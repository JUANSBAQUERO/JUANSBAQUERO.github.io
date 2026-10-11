import { describe, expect, it } from 'vitest';
import { StaticContentRepository } from '../../../src/infrastructure/content/StaticContentRepository';

describe('StaticContentRepository', () => {
  const repo = new StaticContentRepository();

  it('returns the full 5-station layout with unique keys and positions', () => {
    const layout = repo.getStationLayout();
    expect(layout).toHaveLength(5);

    const keys = layout.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length); // no duplicate stations

    for (const station of layout) {
      expect(typeof station.color).toBe('number');
      expect(Number.isFinite(station.position.x)).toBe(true);
      expect(Number.isFinite(station.position.y)).toBe(true);
      expect(Number.isFinite(station.position.z)).toBe(true);
    }
  });

  it('getStationContent returns content whose .key matches the requested key', () => {
    for (const key of ['about', 'experience', 'projects', 'skills', 'contact'] as const) {
      const content = repo.getStationContent(key);
      expect(content.key).toBe(key);
    }
  });

  it('getAllContent exposes exactly the 5 stations declared in the layout', () => {
    const layout = repo.getStationLayout();
    const all = repo.getAllContent();
    for (const station of layout) {
      expect(all[station.key]).toBeDefined();
      expect(all[station.key].key).toBe(station.key);
    }
  });

  it('every station in the layout has a corresponding content entry (no orphan pedestal)', () => {
    const layout = repo.getStationLayout();
    const all = repo.getAllContent();
    expect(Object.keys(all)).toHaveLength(layout.length);
  });
});
