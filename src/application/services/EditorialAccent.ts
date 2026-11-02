/**
 * Wraps the LAST word of a heading in a `<span class="editorial-accent">`
 * so it renders in the italic serif accent font (see main.css
 * `.editorial-accent`) while the rest of the heading keeps the normal
 * display font -- the "big editorial type with one accented word" pattern
 * (inspired by monosexpertos.com's headings), applied generically to any
 * heading string instead of hand-authoring markup per heading.
 *
 * Pure string function (no DOM) so it's unit-testable and reusable by any
 * renderer that wants this treatment.
 *
 * IMPORTANT: does NOT HTML-escape its input and callers render the result
 * via innerHTML -- only ever call this with static, developer-authored
 * copy (locale content files), never with user input or any string that
 * could contain untrusted HTML.
 */
export function wrapLastWordAccent(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) return text;

  const lastSpaceIndex = trimmed.lastIndexOf(' ');
  if (lastSpaceIndex === -1) {
    return `<span class="editorial-accent">${trimmed}</span>`;
  }

  const prefix = trimmed.slice(0, lastSpaceIndex + 1);
  const lastWord = trimmed.slice(lastSpaceIndex + 1);
  return `${prefix}<span class="editorial-accent">${lastWord}</span>`;
}
