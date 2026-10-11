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
  width: number,
  height: number,
): EffectComposer {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // UnrealBloomPass builds its blur mip chain from the resolution passed
  // here. The character stage panel is small (as low as ~250x300px on the
  // Hero), and feeding that tiny size in directly collapses the lower mip
  // levels to 1-2px, which saturates the entire frame to white instead of
  // producing a soft glow. Always build the bloom chain at a fixed,
  // reasonably large resolution regardless of the actual panel size --
  // EffectComposer still composites the result back at the real size.
  const BLOOM_RESOLUTION = 512;
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(BLOOM_RESOLUTION, BLOOM_RESOLUTION),
    0.06, // strength — kept VERY low. UnrealBloomPass saturates the entire
    // frame to near-white even at moderate strength (0.22+) when the scene
    // has large bright/flat-lit areas like this character's skin and shirt
    // -- it is not just a "glow around bright spots" at this scale. 0.06 is
    // the highest value that still leaves flat colors (cream backdrop,
    // shirt, skin) visibly correct while giving the cyan ring/scan-line a
    // faint glow.
    0.4, // radius
    0.9, // threshold — raised further so only the brightest emissive pixels
    // (the cyan ring, scan-line) ever reach the bloom pass at all.
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.setSize(width, height);

  return composer;
}
