import * as THREE from 'three';
import { createBloomComposer } from './postprocessing/BloomComposer';
import type { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { CharacterStage } from './character/CharacterStage';
import { buildStageEnvironment } from './character/StageEnvironment';
import { poseForStation } from '../../application/services/CharacterPoseService';
import { stageBackgroundForStation } from '../../application/services/StageBackground';
import type { StationKey } from '../../domain/entities/Station';

/**
 * Composition root for the scroll-narrative 3D experience: a single
 * fixed-camera character stays centered on screen (in a fixed-size "stage"
 * panel, CSS-positioned by the caller) while the page scrolls past content
 * sections around it. Call `setActiveStation` whenever scroll-spy detects a
 * new active section — the character's pose AND the stage backdrop color
 * both ease toward that station's values.
 *
 * Sized from the CONTAINER element, not the window — the stage is a fixed
 * panel smaller than the viewport (see #character-stage in main.css), not
 * a full-bleed canvas.
 *
 * Unlike the previous FPS PortfolioScene, there is no player movement,
 * input, or collision here — the only moving parts are the character rig
 * and the backdrop color transition.
 */
export class CharacterScene {
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly clock = new THREE.Clock();
  private readonly stage: CharacterStage;
  private readonly resizeObserver: ResizeObserver;
  private frameHandle = 0;
  private targetClearColor = new THREE.Color(0xf4ede2);
  private currentClearColor = new THREE.Color(0xf4ede2);

  constructor(private readonly container: HTMLElement) {
    const { width, height } = this.containerSize();

    this.camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    this.camera.position.set(0, 1.5, 7.5);
    this.camera.lookAt(0, 1.4, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(this.currentClearColor, 1);
    container.appendChild(this.renderer.domElement);

    buildStageEnvironment(this.scene);

    this.stage = new CharacterStage();
    this.scene.add(this.stage.rig.group);

    this.composer = createBloomComposer(this.renderer, this.scene, this.camera);

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
  }

  setActiveStation(key: StationKey | null): void {
    this.stage.setTargetPose(poseForStation(key));
    this.targetClearColor.set(stageBackgroundForStation(key));
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
    this.stage.update(delta, this.clock.elapsedTime);
    this.currentClearColor.lerp(this.targetClearColor, Math.min(1, delta * 4));
    this.renderer.setClearColor(this.currentClearColor, 1);
    this.composer.render();
  };
}
