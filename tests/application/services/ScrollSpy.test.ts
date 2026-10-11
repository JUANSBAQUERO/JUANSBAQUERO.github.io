import { describe, expect, it } from 'vitest';
import { computeActiveSectionKey, type ScrollSection } from '../../../src/application/services/ScrollSpy';

// Mirrors the real layout: a hero screen (no tracked section) sits above
// "about", so the first tracked section's top is > 0.
const sections: readonly ScrollSection[] = [
  { key: 'about', top: 900, height: 800 },
  { key: 'experience', top: 1700, height: 1000 },
  { key: 'projects', top: 2700, height: 1200 },
  { key: 'skills', top: 3900, height: 600 },
  { key: 'contact', top: 4500, height: 900 },
];

const VIEWPORT = 900;

describe('computeActiveSectionKey', () => {
  it('returns null when there are no sections', () => {
    expect(computeActiveSectionKey([], 0, VIEWPORT)).toBeNull();
  });

  it("returns null while scrolled above the first section's trigger point (hero screen)", () => {
    expect(computeActiveSectionKey(sections, 0, VIEWPORT)).toBeNull();
  });

  it('activates "about" once its top edge crosses the trigger line', () => {
    // trigger line = scrollY + viewportHeight * 0.35 = scrollY + 315
    // for "about" (top=900) to activate, we need scrollY + 315 >= 900 -> scrollY >= 585
    expect(computeActiveSectionKey(sections, 584, VIEWPORT)).toBeNull();
    expect(computeActiveSectionKey(sections, 586, VIEWPORT)).toBe('about');
  });

  it('switches to the next section once its top edge crosses the trigger line', () => {
    // for "experience" (top=1700) to activate: scrollY + 315 >= 1700 -> scrollY >= 1385
    expect(computeActiveSectionKey(sections, 1384, VIEWPORT)).toBe('about');
    expect(computeActiveSectionKey(sections, 1386, VIEWPORT)).toBe('experience');
  });

  it('always reports the LAST section whose top has been crossed (not the closest)', () => {
    // scrollY = 2900 -> trigger line = 3215, which has crossed both "experience" (1700)
    // and "projects" (2700) tops but not "skills" (3900) — must report "projects".
    expect(computeActiveSectionKey(sections, 2900, VIEWPORT)).toBe('projects');
  });

  it('reports the last section once scrolled past everything', () => {
    expect(computeActiveSectionKey(sections, 10000, VIEWPORT)).toBe('contact');
  });

  it('respects a custom trigger fraction', () => {
    // With triggerFraction=0 the trigger line equals scrollY exactly.
    expect(computeActiveSectionKey(sections, 1699, VIEWPORT, 0)).toBe('about');
    expect(computeActiveSectionKey(sections, 1700, VIEWPORT, 0)).toBe('experience');
  });
});
