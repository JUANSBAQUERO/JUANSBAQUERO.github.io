export interface ScrollSection {
  readonly key: string;
  /** Distance in px from the top of the document to the section's top edge. */
  readonly top: number;
  readonly height: number;
}

/**
 * Pure function: given section boundaries and the current scroll position,
 * decide which section is "active" for nav highlighting / scroll-spy.
 *
 * A section is active once its top edge has crossed a fixed trigger line
 * (a fraction of the viewport height from the top) — this avoids flickering
 * between sections when a short section is barely visible at the viewport
 * edges. No DOM access here: the caller measures `getBoundingClientRect()` /
 * `offsetTop` and passes plain numbers in, which is what makes this testable
 * without a browser.
 *
 * Returns null both when there are no sections AND when scroll hasn't yet
 * reached the first section's trigger point (e.g. still on a hero screen
 * above every tracked section) — callers should treat null as "no station
 * active" rather than defaulting to the first section.
 */
export function computeActiveSectionKey(
  sections: readonly ScrollSection[],
  scrollY: number,
  viewportHeight: number,
  triggerFraction = 0.35,
): string | null {
  if (sections.length === 0) return null;

  const triggerLine = scrollY + viewportHeight * triggerFraction;

  let active: ScrollSection | null = null;
  for (const section of sections) {
    if (section.top <= triggerLine) {
      if (!active || section.top > active.top) {
        active = section;
      }
    }
  }

  return active ? active.key : null;
}
