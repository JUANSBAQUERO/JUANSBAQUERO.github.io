import type { StationKey } from '../../domain/entities/Station';

/**
 * Pure function: station key -> whether the fixed 3D character should be
 * visible at all. Mirrors the reference site (david-hckh.com): the
 * character is hidden entirely on Projects so the project grid can use
 * the full width without the stage panel competing for space.
 */
export function isCharacterVisibleForStation(key: StationKey | null): boolean {
  return key !== 'projects';
}
