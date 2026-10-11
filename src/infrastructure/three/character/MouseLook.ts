import * as THREE from 'three';

/**
 * Makes the character group subtly track the mouse cursor -- a small yaw/
 * pitch tilt toward the pointer's screen position, eased over time so it
 * reads as "alive" rather than jittery. Pure Three.js math, no dependency
 * on which model is loaded, so it keeps working whether the active
 * character is the current placeholder or the final rigged chibi avatar.
 *
 * Deliberately clamped to a small angle range (see MAX_YAW/MAX_PITCH) --
 * the goal is a subtle head-turn/attention cue, not the character visibly
 * spinning to face the cursor.
 */
const MAX_YAW = 0.22; // radians, ~12.6deg
const MAX_PITCH = 0.1; // radians, ~5.7deg
const EASE = 0.06; // per-frame lerp factor toward the target angle

export class MouseLook {
  private targetYaw = 0;
  private targetPitch = 0;
  private currentYaw = 0;
  private currentPitch = 0;

  constructor(private readonly target: THREE.Object3D) {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseleave', this.handleMouseLeave);
  }

  update(): void {
    this.currentYaw += (this.targetYaw - this.currentYaw) * EASE;
    this.currentPitch += (this.targetPitch - this.currentPitch) * EASE;
    this.target.rotation.y = this.currentYaw;
    this.target.rotation.x = this.currentPitch;
  }

  dispose(): void {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  private handleMouseMove = (e: MouseEvent): void => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
    const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
    this.targetYaw = -nx * MAX_YAW;
    this.targetPitch = ny * MAX_PITCH;
  };

  private handleMouseLeave = (): void => {
    this.targetYaw = 0;
    this.targetPitch = 0;
  };
}
