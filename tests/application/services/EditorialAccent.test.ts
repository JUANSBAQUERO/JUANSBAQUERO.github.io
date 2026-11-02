import { describe, expect, it } from 'vitest';
import { wrapLastWordAccent } from '../../../src/application/services/EditorialAccent';

describe('wrapLastWordAccent', () => {
  it('wraps only the last word in the accent span', () => {
    const html = wrapLastWordAccent('Selected Work');
    expect(html).toBe('Selected <span class="editorial-accent">Work</span>');
  });

  it('wraps the whole string when there is only one word', () => {
    const html = wrapLastWordAccent('Contact');
    expect(html).toBe('<span class="editorial-accent">Contact</span>');
  });

  it('handles multi-word headings with more than two words', () => {
    const html = wrapLastWordAccent("What I'm poking at lately");
    expect(html).toBe('What I\'m poking at <span class="editorial-accent">lately</span>');
  });

  it('trims surrounding whitespace before wrapping', () => {
    const html = wrapLastWordAccent('  Skills & Stack  ');
    expect(html).toBe('Skills & <span class="editorial-accent">Stack</span>');
  });

  it('returns the original (falsy-safe) text unchanged for an empty string', () => {
    expect(wrapLastWordAccent('')).toBe('');
  });

  it('preserves accented/non-ASCII characters in the wrapped word', () => {
    const html = wrapLastWordAccent('Construyamos algo juntos');
    expect(html).toBe('Construyamos algo <span class="editorial-accent">juntos</span>');
  });
});
