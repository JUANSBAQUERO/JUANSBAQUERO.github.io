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
  // Margins below are generous on purpose: the journey stage band's own
  // CSS height (--stage-band-height) was shrunk from 46vh to 30vh per
  // portfolio feedback, which made the band's aspect ratio much WIDER
  // relative to its height at the same viewport width. A PerspectiveCamera
  // with a fixed vertical FOV shows a proportionally wider horizontal
  // frustum as aspect ratio grows, so floor/backdrop planes sized only for
  // the old (taller) band's frustum no longer reach its edges -- the
  // renderer's clear color showed through at the top/side corners, and the
  // mountain backdrop read as an over-zoomed crop. Oversizing both planes
  // well past any aspect ratio the band is likely to use avoids having to
  // re-tune this every time the band height changes (see
  // threejs-webgl-development skill: "fixed camera must be framed against
  // the most-extended case").
  floorTexture.repeat.set((TRACK_MAX_X - TRACK_MIN_X + 30) / 2, 1);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(TRACK_MAX_X - TRACK_MIN_X + 30, 20),
    new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.8, metalness: 0.05 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((TRACK_MIN_X + TRACK_MAX_X) / 2, -0.02, 0);
  scene.add(floor);

  // Backdrop: warm anime sunset sky with mountain silhouettes, replacing
  // the earlier flat blue-gray clear color / code-editor panel. Sized with
  // the same generous margin as the floor above, for the same reason.
  const skyTexture = createAnimeSkyTexture();
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(TRACK_MAX_X - TRACK_MIN_X + 70, 34),
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
