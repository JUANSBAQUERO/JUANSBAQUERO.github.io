import type { StationKey } from '../../domain/entities/Station';

/**
 * Background color the fixed character stage should show behind the 3D
 * canvas for a given active section — must stay in sync with the
 * `--section-*` CSS custom properties in main.css (duplicated here because
 * UnrealBloomPass does not preserve the alpha channel, so the canvas can't
 * be truly transparent; matching the backdrop color is the simplest fix and
 * mirrors how the reference site keeps the character on a solid colored
 * panel per section rather than a transparent cutout).
 */
const STAGE_BACKGROUND_BY_STATION: Record<StationKey, string> = {
  about: '#0f1f33',
  experience: '#122b3f',
  projects: '#f4ede2',
  skills: '#1a2f1f',
  contact: '#f4ede2',
};

export const DEFAULT_STAGE_BACKGROUND = '#f4ede2';

export function stageBackgroundForStation(key: StationKey | null): string {
  return key ? STAGE_BACKGROUND_BY_STATION[key] : DEFAULT_STAGE_BACKGROUND;
}
