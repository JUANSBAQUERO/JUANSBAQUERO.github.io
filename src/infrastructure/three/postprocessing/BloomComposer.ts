import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/**
 * Builds the neon-glow bloom pipeline. Isolated so bloom strength/radius/
 * threshold can be tuned without touching scene or camera setup code.
 */
export function createBloomComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): EffectComposer {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.22, // strength — kept low: a bright cream/white backdrop (Hero, Projects,
    // Contact) exceeds the luminance threshold on its own and blooms the
    // whole frame, washing out the character's flat colors. Low strength
    // keeps the cyan ring/scan-line glow visible without that wash-out.
    0.4, // radius
    0.85, // threshold — only strongly emissive pixels (rings, scan FX) bloom
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  return composer;
}
