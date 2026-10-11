import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const MODEL_URL = '/models/character.glb';
const DRACO_DECODER_PATH = '/draco/';

/**
 * Lazy-loads the rigged, textured .glb character (real Blender/Mixamo rig +
 * an idle/swing animation baked in Mixamo) and plays its one animation in a
 * loop once loaded. The procedural placeholder stays visible in the group
 * until this resolves, so there is never a blank stage while the ~17MB
 * model downloads in the background (see CharacterScene for the swap).
 */
export class RiggedCharacter {
  readonly group = new THREE.Group();
  private mixer: THREE.AnimationMixer | null = null;
  private loaded = false;

  async load(): Promise<void> {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const gltf = await loader.loadAsync(MODEL_URL);
    const model = gltf.scene;

    // Exported from a Blender/Mixamo round-trip in centimeters; normalize
    // to the ~1-unit-tall scale the rest of the scene (camera, lights,
    // pedestal) is built around.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && maxDim < 0.1) {
      model.scale.setScalar(1 / maxDim);
    }

    const scaledBox = new THREE.Box3().setFromObject(model);
    const center = scaledBox.getCenter(new THREE.Vector3());
    model.position.sub(new THREE.Vector3(center.x, scaledBox.min.y, center.z));

    model.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });

    this.group.add(model);

    if (gltf.animations.length) {
      this.mixer = new THREE.AnimationMixer(model);
      const action = this.mixer.clipAction(gltf.animations[0]);
      action.play();
    }

    this.loaded = true;
  }

  get isLoaded(): boolean {
    return this.loaded;
  }

  update(delta: number): void {
    this.mixer?.update(delta);
  }

  dispose(): void {
    this.mixer?.stopAllAction();
  }
}
