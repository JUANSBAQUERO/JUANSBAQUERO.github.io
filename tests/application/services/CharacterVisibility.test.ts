import { describe, it, expect } from 'vitest';
import { isCharacterVisibleForStation } from '../../../src/application/services/CharacterVisibility';

describe('isCharacterVisibleForStation', () => {
  it('hides the character on Projects', () => {
    expect(isCharacterVisibleForStation('projects')).toBe(false);
  });

  it('shows the character on every other station, including the hero (null)', () => {
    expect(isCharacterVisibleForStation(null)).toBe(true);
    expect(isCharacterVisibleForStation('about')).toBe(true);
    expect(isCharacterVisibleForStation('experience')).toBe(true);
    expect(isCharacterVisibleForStation('skills')).toBe(true);
    expect(isCharacterVisibleForStation('contact')).toBe(true);
  });
});
