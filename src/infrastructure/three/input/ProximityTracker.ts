import * as THREE from 'three';
import type { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import type { StationKey } from '../../../domain/entities/Station';
import type { PedestalUserData } from '../scene/Pedestal';

/**
 * Finds the nearest pedestal within interaction range of the player, each
 * frame. Pure "what's nearby" responsibility — knows nothing about panels,
 * keyboard, or rendering.
 */
export class ProximityTracker {
  private nearby: THREE.Group | null = null;

  constructor(
    private readonly controls: PointerLockControls,
    private readonly pedestals: readonly THREE.Group[],
  ) {}

  update(isPanelOpen: boolean): THREE.Group | null {
    if (isPanelOpen) {
      this.nearby = null;
      return null;
    }

    const rig = this.controls.getObject();
    let nearest: THREE.Group | null = null;
    let nearestDist = Infinity;

    for (const pedestal of this.pedestals) {
      const data = pedestal.userData as PedestalUserData;
      const dx = rig.position.x - pedestal.position.x;
      const dz = rig.position.z - pedestal.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < data.interactRadius && dist < nearestDist) {
        nearest = pedestal;
        nearestDist = dist;
      }
    }

    this.nearby = nearest;
    return nearest;
  }

  get currentKey(): StationKey | null {
    return this.nearby ? (this.nearby.userData as PedestalUserData).key : null;
  }
}
