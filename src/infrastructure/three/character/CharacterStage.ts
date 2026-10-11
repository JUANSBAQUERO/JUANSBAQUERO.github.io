import * as THREE from 'three';
import { createCharacter, type CharacterRig } from './Character';
import type { CharacterPose } from '../../../application/services/CharacterPoseService';

const LERP_SPEED = 4; // higher = snappier pose transitions

/**
 * Drives a CharacterRig toward a target CharacterPose over time (smooth
 * lerp, not an instant snap) and owns the idle bob / scan-line animation.
 * Keeps "how a pose is physically applied" separate from "what pose goes
 * with what section" (CharacterPoseService).
 */
export class CharacterStage {
  readonly rig: CharacterRig;
  private target: CharacterPose;
  private current: CharacterPose;
  private scanElapsed = 0;

  constructor() {
    this.rig = createCharacter();
    const idle: CharacterPose = {
      leftArmX: 0,
      rightArmX: 0,
      leftArmZ: 0,
      rightArmZ: 0,
      headTilt: 0,
      scanning: false,
      bobIntensity: 1,
    };
    this.target = idle;
    this.current = idle;
  }

  setTargetPose(pose: CharacterPose): void {
    this.target = pose;
  }

  update(delta: number, elapsed: number): void {
    const t = Math.min(1, delta * LERP_SPEED);
    this.current = {
      leftArmX: THREE.MathUtils.lerp(this.current.leftArmX, this.target.leftArmX, t),
      rightArmX: THREE.MathUtils.lerp(this.current.rightArmX, this.target.rightArmX, t),
      leftArmZ: THREE.MathUtils.lerp(this.current.leftArmZ, this.target.leftArmZ, t),
      rightArmZ: THREE.MathUtils.lerp(this.current.rightArmZ, this.target.rightArmZ, t),
      headTilt: THREE.MathUtils.lerp(this.current.headTilt, this.target.headTilt, t),
      scanning: this.target.scanning,
      bobIntensity: THREE.MathUtils.lerp(this.current.bobIntensity, this.target.bobIntensity, t),
    };

    this.rig.leftArm.rotation.set(0, 0, Math.PI + this.current.leftArmZ);
    this.rig.leftArm.rotation.x = this.current.leftArmX;
    this.rig.rightArm.rotation.set(0, 0, -this.current.rightArmZ);
    this.rig.rightArm.rotation.x = this.current.rightArmX;
    this.rig.head.rotation.z = this.current.headTilt;

    // idle bob
    const bob = Math.sin(elapsed * 1.6) * 0.06 * this.current.bobIntensity;
    this.rig.group.position.y = bob;

    // hologram scan-line sweep
    const targetOpacity = this.target.scanning ? 0.85 : 0;
    for (const material of this.rig.hologramMaterials) {
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, t);
    }
    const scanMaterial = this.rig.scanPlane.material as THREE.MeshBasicMaterial;
    scanMaterial.opacity = THREE.MathUtils.lerp(scanMaterial.opacity, targetOpacity, t);

    if (this.target.scanning) {
      this.scanElapsed += delta;
      const cycle = (this.scanElapsed % 2) / 2; // 2s loop
      this.rig.scanPlane.position.y = 0.5 + cycle * 1.7;
    }
  }
}
