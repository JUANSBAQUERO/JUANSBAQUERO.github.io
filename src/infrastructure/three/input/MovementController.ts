import * as THREE from "three";
import type { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import type { KeyState } from "../input/KeyboardInput";
import { PLAY_RADIUS } from "../scene/Environment";
import type { PedestalUserData } from "../scene/Pedestal";

/**
 * Applies WASD movement, damping, the plaza boundary clamp, and pedestal
 * collision push-back to the PointerLockControls camera rig. Kept separate
 * from KeyboardInput (which only reports *what keys are down*) and from
 * ProximityTracker (which only reports *what's nearby*) — each class has one
 * reason to change.
 */
export class MovementController {
  private readonly velocity = new THREE.Vector3();
  private readonly tmpDir = new THREE.Vector3();

  constructor(
    private readonly controls: PointerLockControls,
    private readonly pedestals: readonly THREE.Group[],
    private readonly clock: THREE.Clock,
  ) {}

  update(delta: number, keys: KeyState, isPanelOpen: boolean): void {
    if (!this.controls.isLocked || isPanelOpen) return;

    const speed = 9.0;
    const damping = Math.pow(0.0001, delta);
    this.velocity.x *= damping;
    this.velocity.z *= damping;

    this.tmpDir.z = Number(keys.w) - Number(keys.s);
    this.tmpDir.x = Number(keys.d) - Number(keys.a);
    this.tmpDir.normalize();

    if (keys.w || keys.s) this.velocity.z -= this.tmpDir.z * speed * delta * 10;
    if (keys.a || keys.d) this.velocity.x -= this.tmpDir.x * speed * delta * 10;

    const rig = this.controls.getObject();

    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    this.clampToBoundary(rig);
    this.resolvePedestalCollisions(rig);
    this.applyHeadBob(rig, keys);
  }

  private clampToBoundary(rig: THREE.Object3D): void {
    const distFromCenter = Math.sqrt(rig.position.x ** 2 + rig.position.z ** 2);
    if (distFromCenter > PLAY_RADIUS) {
      const angle = Math.atan2(rig.position.z, rig.position.x);
      rig.position.x = Math.cos(angle) * PLAY_RADIUS;
      rig.position.z = Math.sin(angle) * PLAY_RADIUS;
    }
  }

  private resolvePedestalCollisions(rig: THREE.Object3D): void {
    for (const pedestal of this.pedestals) {
      const data = pedestal.userData as PedestalUserData;
      const dx = rig.position.x - pedestal.position.x;
      const dz = rig.position.z - pedestal.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = data.collisionRadius;
      if (dist < minDist && dist > 0.0001) {
        const push = minDist - dist;
        rig.position.x += (dx / dist) * push;
        rig.position.z += (dz / dist) * push;
      }
    }
  }

  private applyHeadBob(rig: THREE.Object3D, keys: KeyState): void {
    if (keys.w || keys.a || keys.s || keys.d) {
      const t = this.clock.elapsedTime * 10;
      rig.position.y = 1.7 + Math.sin(t) * 0.035;
    } else {
      rig.position.y = 1.7;
    }
  }
}
