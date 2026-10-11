import type { StationKey } from '../../domain/entities/Station';

export interface CharacterPose {
  /** Left/right arm rotation on X (radians). Negative = raised forward/up. */
  readonly leftArmX: number;
  readonly rightArmX: number;
  /** Arm rotation on Z (radians). Used for the crossed-arms "contact" pose. */
  readonly leftArmZ: number;
  readonly rightArmZ: number;
  /** Head tilt on Z (radians). */
  readonly headTilt: number;
  /** Whether the hologram scan-line effect should be visible (About section). */
  readonly scanning: boolean;
  /** Overall body bob amplitude multiplier (0 = still, 1 = normal idle bob). */
  readonly bobIntensity: number;
}

const DEFAULT_POSE: CharacterPose = {
  leftArmX: 0,
  rightArmX: 0,
  leftArmZ: 0,
  rightArmZ: 0,
  headTilt: 0,
  scanning: false,
  bobIntensity: 1,
};

/**
 * Pure function: station key -> the character's pose for that section.
 * Kept separate from the Three.js rig (CharacterStage) so the *decision* of
 * "what pose goes with what section" is unit-testable without WebGL, and so
 * designers/content editors can tweak poses without touching render code.
 */
export function poseForStation(key: StationKey | null): CharacterPose {
  switch (key) {
    case 'about':
      return { ...DEFAULT_POSE, scanning: true, headTilt: 0.05 };

    case 'experience':
      return { ...DEFAULT_POSE, rightArmX: -0.9, headTilt: -0.08 };

    case 'projects':
      return { ...DEFAULT_POSE, leftArmX: -0.5, rightArmX: -0.5, bobIntensity: 1.3 };

    case 'skills':
      return { ...DEFAULT_POSE, leftArmX: -1.1, rightArmX: -1.1, headTilt: 0.1 };

    case 'contact':
      return { ...DEFAULT_POSE, leftArmZ: 0.5, rightArmZ: -0.5, headTilt: -0.05 };

    default:
      return DEFAULT_POSE;
  }
}
