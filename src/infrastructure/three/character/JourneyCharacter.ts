import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const DRACO_DECODER_PATH = '/draco/';
const MODEL_URL = '/models/juan/journey.glb';

/**
 * Loads the SINGLE rigged character GLB that carries all four journey
 * animation clips (Running, Walking, Gentlemans_Bow, dying_backwards) baked
 * from Meshy's Animate module. Unlike the old RiggedCharacter (one .glb per
 * pose, swapped in/out), this loads once and switches between
 * AnimationActions on the same mixer -- cheaper (one fetch) and allows
 * crossfading between clips as the character moves between journey scenes.
 */
export class JourneyCharacter {
  readonly group = new THREE.Group();
  private model: THREE.Object3D | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private actions = new Map<string, THREE.AnimationAction>();
  private currentAction: THREE.AnimationAction | null = null;
  private loadPromise: Promise<void> | null = null;
  private targetFacingY = Math.PI / 2;
  onLoadingChange: ((loading: boolean) => void) | null = null;

  async load(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      this.onLoadingChange?.(true);
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      const gltf = await loader.loadAsync(MODEL_URL);
      const model = gltf.scene;
      this.normalizeScale(model);
      model.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          obj.castShadow = false;
          obj.receiveShadow = false;
        }
      });

      this.mixer = new THREE.AnimationMixer(model);
      for (const clip of gltf.animations) {
        this.actions.set(clip.name, this.mixer.clipAction(clip));
      }

      this.model = model;
      model.rotation.y = this.targetFacingY;
      this.group.add(model);
      this.onLoadingChange?.(false);
    })();

    return this.loadPromise;
  }

  /**
   * Crossfades to the named clip. `loop` controls whether it repeats
   * (walk/run) or plays once and freezes on its last frame (crash impact,
   * bow) -- THREE.LoopOnce + clampWhenFinished so a one-shot clip doesn't
   * snap back to frame 0 the instant it ends.
   *
   * Phase-syncs the incoming clip to the outgoing one's normalized stride
   * position (time / duration) before blending, and crossfades with
   * `warp: true` -- without this, two walk-cycle clips blend while running
   * on independent, unsynced clocks, so one leg can be mid-air on one clip
   * while the other has already planted on the next, which reads as the
   * character briefly floating/levitating through the transition instead
   * of smoothly changing gait.
   */
  playClip(name: string, loop: boolean, crossfadeSeconds = 0.5): void {
    const next = this.actions.get(name);
    if (!next) {
      console.warn(`JourneyCharacter: unknown clip "${name}"`);
      return;
    }
    if (this.currentAction === next) return;

    next.reset();
    next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    next.clampWhenFinished = !loop;
    next.enabled = true;

    if (this.currentAction && loop && this.currentAction.getClip().duration > 0) {
      const currentClip = this.currentAction.getClip();
      const normalizedPhase = (this.currentAction.time % currentClip.duration) / currentClip.duration;
      next.time = normalizedPhase * next.getClip().duration;
    }

    next.play();

    if (this.currentAction) {
      this.currentAction.crossFadeTo(next, crossfadeSeconds, true);
    } else {
      next.fadeIn(crossfadeSeconds);
    }
    this.currentAction = next;
  }

  /**
   * Sets the target Y-axis facing angle (radians); update() eases the
   * model's actual rotation toward it each frame so turning (e.g. walk/run
   * facing right -> final bow facing the camera) reads as a smooth turn
   * instead of an instant snap.
   */
  setFacing(angleY: number): void {
    this.targetFacingY = angleY;
  }

  update(delta: number): void {
    this.mixer?.update(delta);
    if (this.model) {
      const diff = this.shortestAngleDiff(this.model.rotation.y, this.targetFacingY);
      this.model.rotation.y += diff * Math.min(1, delta * 3);
    }
  }

  dispose(): void {
    this.mixer?.stopAllAction();
  }

  /** Shortest signed angular difference from `from` to `to`, wrapped to
   *  [-PI, PI] -- prevents the lerp from spinning the long way around when
   *  crossing the wrap point (e.g. easing from just past PI toward just
   *  past -PI should turn a few degrees, not nearly all the way around). */
  private shortestAngleDiff(from: number, to: number): number {
    let diff = (to - from) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    return diff;
  }

  /** Mixamo/Meshy rigs export in centimeters; normalize to ~1-unit-tall and
   *  sit on the floor, centered, same approach as the old RiggedCharacter. */
  private normalizeScale(model: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && maxDim < 0.1) {
      model.scale.setScalar(1 / maxDim);
    }
    const scaledBox = new THREE.Box3().setFromObject(model);
    const center = scaledBox.getCenter(new THREE.Vector3());
    model.position.sub(new THREE.Vector3(center.x, scaledBox.min.y, center.z));
  }
}
