import * as THREE from "three";
import type { PedestalUserData } from "./Pedestal";

/**
 * Drives the idle animations of every pedestal (spinning ring, bobbing gem)
 * and any scene object flagged `userData.spin` (e.g. the central core).
 * Pure per-frame visual behavior — not movement, not content.
 */
export function animatePedestals(
  pedestals: readonly THREE.Group[],
  delta: number,
  elapsed: number,
): void {
  for (const pedestal of pedestals) {
    const data = pedestal.userData as PedestalUserData;
    data.gem.rotation.y += delta * 0.6;
    data.gem.position.y =
      2.1 + Math.sin(elapsed * 1.4 + pedestal.position.x) * 0.12;
    data.spinRing.rotation.z += delta * 0.4;
  }
}

export function animateSpinningLandmarks(
  scene: THREE.Scene,
  delta: number,
): void {
  scene.traverse((obj) => {
    if (obj.userData?.spin) {
      obj.rotation.y += delta * 0.15;
    }
  });
}
