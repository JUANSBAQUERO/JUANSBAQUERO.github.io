import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { buildEnvironment } from './scene/Environment';
import { createPedestal } from './scene/Pedestal';
import { animatePedestals, animateSpinningLandmarks } from './scene/PedestalAnimator';
import { createBloomComposer } from './postprocessing/BloomComposer';
import type { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { KeyboardInput } from './input/KeyboardInput';
import { MovementController } from './input/MovementController';
import { ProximityTracker } from './input/ProximityTracker';

import type { ContentRepository } from '../../domain/repositories/ContentRepository';
import type { StationKey } from '../../domain/entities/Station';

export interface PortfolioSceneCallbacks {
  onLock: () => void;
  onUnlock: () => void;
  onProximityChange: (stationKey: StationKey | null, title: string | null) => void;
  onInteract: (stationKey: StationKey) => void;
  onEscape: () => void;
}

/**
 * Composition root for the 3D experience: wires environment, pedestals,
 * bloom, input and movement together and drives the render loop.
 *
 * This is the ONLY class that knows about every infrastructure piece at
 * once — everything it depends on (ContentRepository) is an abstraction
 * from the domain layer, never a concrete data source (Dependency Inversion).
 * Presentation (HUD/panels) talks to this class only through the
 * PortfolioSceneCallbacks it receives — it never touches Three.js directly.
 */
export class PortfolioScene {
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly controls: PointerLockControls;
  private readonly clock = new THREE.Clock();
  private readonly pedestals: THREE.Group[] = [];
  private readonly keyboard: KeyboardInput;
  private readonly movement: MovementController;
  private readonly proximity: ProximityTracker;

  private panelOpen = false;
  private frameHandle = 0;

  constructor(
    container: HTMLElement,
    private readonly content: ContentRepository,
    private readonly callbacks: PortfolioSceneCallbacks,
  ) {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, 1.7, 17);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(this.renderer.domElement);

    buildEnvironment(this.scene);

    for (const station of content.getStationLayout()) {
      const stationContent = content.getStationContent(station.key);
      const pedestal = createPedestal(station, stationContent.title);
      this.scene.add(pedestal);
      this.pedestals.push(pedestal);
    }

    this.composer = createBloomComposer(this.renderer, this.scene, this.camera);

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.scene.add(this.controls.getObject());

    this.movement = new MovementController(this.controls, this.pedestals, this.clock);
    this.proximity = new ProximityTracker(this.controls, this.pedestals);
    this.keyboard = new KeyboardInput((action) => this.handleAction(action));

    this.bindEvents();
  }

  start(): void {
    this.keyboard.attach();
    this.animate();
  }

  dispose(): void {
    cancelAnimationFrame(this.frameHandle);
    this.keyboard.detach();
    window.removeEventListener('resize', this.handleResize);
  }

  lock(): void {
    this.controls.lock();
  }

  setPanelOpen(open: boolean): void {
    this.panelOpen = open;
    if (!open) this.controls.unlock();
  }

  private bindEvents = (): void => {
    window.addEventListener('resize', this.handleResize);
    this.controls.addEventListener('lock', () => this.callbacks.onLock());
    this.controls.addEventListener('unlock', () => {
      this.callbacks.onUnlock();
    });
  };

  private handleResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  };

  private handleAction(action: 'interact' | 'close-panel'): void {
    if (action === 'interact') {
      const key = this.proximity.currentKey;
      if (key && !this.panelOpen) {
        this.panelOpen = true;
        this.controls.unlock();
        this.callbacks.onInteract(key);
      }
    } else if (action === 'close-panel' && this.panelOpen) {
      this.callbacks.onEscape();
    }
  }

  private animate = (): void => {
    this.frameHandle = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    this.movement.update(delta, this.keyboard.keys, this.panelOpen);

    const nearest = this.proximity.update(this.panelOpen);
    if (nearest) {
      const key = this.proximity.currentKey!;
      this.callbacks.onProximityChange(key, this.content.getStationContent(key).title);
    } else {
      this.callbacks.onProximityChange(null, null);
    }

    animatePedestals(this.pedestals, delta, this.clock.elapsedTime);
    animateSpinningLandmarks(this.scene, delta);

    this.composer.render();
  };
}
