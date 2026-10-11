import { describe, expect, it } from 'vitest';
import {
  DEFAULT_STAGE_BACKGROUND,
  stageBackgroundForStation,
} from '../../../src/application/services/StageBackground';

describe('stageBackgroundForStation', () => {
  it('returns the default cream background when no section is active (hero)', () => {
    expect(stageBackgroundForStation(null)).toBe(DEFAULT_STAGE_BACKGROUND);
  });

  it('returns a distinct color for every station', () => {
    const keys = ['about', 'experience', 'projects', 'skills', 'contact'] as const;
    const colors = keys.map((k) => stageBackgroundForStation(k));
    expect(colors.every((c) => /^#[0-9a-fA-F]{6}$/.test(c))).toBe(true);
  });

  it('matches the cream background for projects and contact (light sections)', () => {
    expect(stageBackgroundForStation('projects')).toBe(DEFAULT_STAGE_BACKGROUND);
    expect(stageBackgroundForStation('contact')).toBe(DEFAULT_STAGE_BACKGROUND);
  });

  it('uses a dark background for about/experience/skills', () => {
    for (const key of ['about', 'experience', 'skills'] as const) {
      expect(stageBackgroundForStation(key)).not.toBe(DEFAULT_STAGE_BACKGROUND);
    }
  });
});
