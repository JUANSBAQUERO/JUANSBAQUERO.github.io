import * as THREE from 'three';
import { createWoodPlankFloorTexture } from './WoodPlankFloorTexture';
import { createAnimeSkyTexture } from './AnimeSkyBackground';
import { createLanternPost } from './LanternPost';
import { FallingLeaves } from './FallingLeaves';

/**
 * Builds the lighting and the long walking "village path" the character
 * travels across: a warm sunset sky backdrop, a wooden plank walkway, and
 * bamboo lantern posts spaced along it (replacing the earlier flat cyan
 * marker bars) -- the posts still give the eye a stationary reference so
 * the character's left-to-right travel reads as motion, but now fit a
 * warm anime-village mood instead of a tech-UI one.
 */
const TRACK_MIN_X = -9;
const TRACK_MAX_X = 9;
const POST_SPACING = 2.2;

export function buildJourneyEnvironment(scene: THREE.Scene): FallingLeaves {
  scene.add(new THREE.AmbientLight(0xfff0dc, 0.55));

  const keyLight = new THREE.DirectionalLight(0xffcf9e, 1.0);
  keyLight.position.set(2, 6, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xff8a5a, 0.4);
  fillLight.position.set(-3, 3, 4);
  scene.add(fillLight);

  const floorTexture = createWoodPlankFloorTexture();
  floorTexture.repeat.set((TRACK_MAX_X - TRACK_MIN_X + 6) / 2, 1);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(TRACK_MAX_X - TRACK_MIN_X + 6, 6),
    new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.8, metalness: 0.05 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((TRACK_MIN_X + TRACK_MAX_X) / 2, -0.02, 0);
  scene.add(floor);

  // Backdrop: warm anime sunset sky with mountain silhouettes, replacing
  // the earlier flat blue-gray clear color / code-editor panel.
  const skyTexture = createAnimeSkyTexture();
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(TRACK_MAX_X - TRACK_MIN_X + 24, 16),
    new THREE.MeshBasicMaterial({ map: skyTexture }),
  );
  backdrop.position.set((TRACK_MIN_X + TRACK_MAX_X) / 2, 5, -6);
  scene.add(backdrop);

  for (let x = TRACK_MIN_X; x <= TRACK_MAX_X; x += POST_SPACING) {
    const post = createLanternPost();
    post.position.set(x, 0, -1.7);
    scene.add(post);
  }

  // Ambient falling leaves drifting across the whole scene -- generic leaf
  // silhouettes (see FallingLeaves.ts), updated every frame from
  // JourneyScene's render loop.
  const leaves = new FallingLeaves();
  scene.add(leaves.points);

  return leaves;
}
