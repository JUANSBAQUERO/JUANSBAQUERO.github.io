/**
 * Toggles an `.is-revealed` class on each observed element as it enters or
 * leaves the viewport, driving the beat-card entrance/exit CSS transitions
 * (main.css `.beat-card` / `.is-revealed`).
 *
 * Toggles in BOTH directions (not just "reveal once on first view") on
 * purpose: scrolling back up past a card re-hides it, so revisiting it by
 * scrolling back down plays the entrance again instead of it sitting there
 * statically forever -- this is what makes the journey feel like a sequence
 * of beats rather than one long static page.
 *
 * Takes an injectable IntersectionObserver factory so it's unit-testable
 * without a real browser (jsdom doesn't implement IntersectionObserver).
 */
export class RevealController {
  constructor(
    private readonly targets: Iterable<Element>,
    private readonly createObserver: (
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) => IntersectionObserver = (callback, options) => new IntersectionObserver(callback, options),
  ) {}

  start(): void {
    const observer = this.createObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-revealed', entry.isIntersecting);
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    );
    for (const target of this.targets) observer.observe(target);
  }

  /** Used for the prefers-reduced-motion path: skip the observer/animation
   *  entirely and just mark every target revealed immediately. */
  static revealAllImmediately(targets: Iterable<Element>): void {
    for (const target of targets) target.classList.add('is-revealed');
  }
}
