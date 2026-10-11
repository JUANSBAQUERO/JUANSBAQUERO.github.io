import * as THREE from 'three';
import { createBloomComposer } from './postprocessing/BloomComposer';
import type { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { JourneyCharacter } from './character/JourneyCharacter';
import { buildJourneyEnvironment } from './character/JourneyEnvironment';
import { MouseLook } from './character/MouseLook';
import type { FallingLeaves } from './character/FallingLeaves';
import { ImpactEffect } from './character/ImpactEffect';
import type { JourneyScene as JourneySceneData } from '../../domain/entities/Journey';

/**
 * Composition root for the new "journey" narrative: a fixed full-viewport
 * canvas with a camera that tracks the character horizontally as it walks,
 * runs, crashes, then bows across the X axis, driven by scroll (see
 * JourneyProgress.ts for the pure scroll -> {scene, x} math; main.ts calls
 * `setPosition` every scroll frame with its output).
 *
 * Replaces the old CharacterScene (fixed-camera, character swaps pose in
 * place inside a small center panel) -- kept as a SEPARATE class rather
 * than modifying CharacterScene in place, since the camera/character
 * relationship is fundamentally different (tracking shot vs. static shot).
 */
export class JourneyScene {
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly clock = new THREE.Clock();
  private readonly character = new JourneyCharacter();
  private readonly mouseLook = new MouseLook(this.character.group);
  private readonly leaves: FallingLeaves;
  private readonly impactEffect = new ImpactEffect();
  private readonly resizeObserver: ResizeObserver;
  private frameHandle = 0;

  private cameraTargetX = 0;
  private currentClipName: string | null = null;
  private lastScene: JourneySceneData | null = null;

  constructor(
    private readonly container: HTMLElement,
    private readonly loaderEl: HTMLElement | null,
  ) {
    const { width, height } = this.containerSize();

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 1.35, 6.5);
    this.camera.lookAt(0, 0.95, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(0x0b1420, 1);
    container.appendChild(this.renderer.domElement);

    this.leaves = buildJourneyEnvironment(this.scene);
    this.scene.add(this.impactEffect.group);

    this.scene.add(this.character.group);
    this.character.onLoadingChange = (loading) => {
      this.loaderEl?.classList.toggle('is-active', loading);
    };
    // setPosition() runs synchronously at bootstrap (before this fetch
    // resolves), so the very first playClip() call lands on an empty
    // actions map and silently no-ops -- the character would otherwise
    // sit frozen in the GLB's raw bind/T-pose until scroll crosses into a
    // DIFFERENT scene (setPosition only replays a clip when its name
    // CHANGES). Replay whatever scene was last requested once loading
    // actually finishes, bypassing that name-change guard, so playback
    // starts immediately in the correct pose (Walking) instead of T-pose.
    this.character
      .load()
      .then(() => {
        if (this.lastScene) {
          this.character.setFacing(this.lastScene.facingY);
          this.character.playClip(this.lastScene.clipName, this.lastScene.loop, 0);
        }
      })
      .catch((err) => {
        console.warn('Failed to load journey character:', err);
      });

    this.composer = createBloomComposer(this.renderer, this.scene, this.camera, width, height);

    window.addEventListener('resize', this.handleResize);
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(container);
  }

  start(): void {
    this.animate();
  }

  dispose(): void {
    cancelAnimationFrame(this.frameHandle);
    window.removeEventListener('resize', this.handleResize);
    this.resizeObserver.disconnect();
    this.character.dispose();
    this.mouseLook.dispose();
    this.leaves.dispose();
    this.impactEffect.dispose();
  }

  /** Called every scroll/resize frame from main.ts with the pure-function
   *  output of JourneyProgress.computeCharacterPosition. */
  setPosition(scene: JourneySceneData, characterX: number): void {
    this.lastScene = scene;
    this.character.group.position.x = characterX;
    this.character.setFacing(scene.facingY);
    this.cameraTargetX = characterX;

    if (this.currentClipName !== scene.clipName) {
      const isEnteringCrash = scene.key === 'crash' && this.currentClipName !== scene.clipName;
      this.currentClipName = scene.clipName;
      this.character.playClip(scene.clipName, scene.loop);
      if (isEnteringCrash) {
        this.impactEffect.trigger(this.character.group.position);
      }
    }
  }

  private containerSize(): { width: number; height: number } {
    const rect = this.container.getBoundingClientRect();
    return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
  }

  private handleResize = (): void => {
    const { width, height } = this.containerSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  };

  private animate = (): void => {
    this.frameHandle = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.character.update(delta);
    this.mouseLook.update();
    this.leaves.update(delta);
    this.impactEffect.update(delta);

    // Camera eases toward the character's current X so it reads as a
    // tracking shot following the walk/run, not an instant cut.
    this.camera.position.x += (this.cameraTargetX - this.camera.position.x) * Math.min(1, delta * 2.5);
    this.camera.lookAt(this.camera.position.x, 1.1, 0);

    this.composer.render();
  };
}
