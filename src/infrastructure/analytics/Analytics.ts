import posthog from 'posthog-js';

/**
 * Thin wrapper around posthog-js. Keeps the rest of the app from importing
 * posthog directly -- only this adapter does, same pattern as SmoothScroll
 * wrapping Lenis. Captures pageviews/clicks/scroll depth automatically
 * (posthog-js's built-in autocapture + session recording), plus one custom
 * event (`section_viewed`) so "how far did people get" is queryable
 * directly instead of inferred from raw scroll pixels.
 *
 * PostHog's own autocapture already answers "do people visit" (pageviews)
 * and "where do they scroll to" (scroll-depth tracking + session replay),
 * which is why this wrapper stays this thin -- it only adds the one signal
 * autocapture can't give for free: which named CONTENT SECTION (not just
 * raw scroll %) a visitor reached, which matters more on this single-page
 * scroll-journey site than generic pixel depth.
 */
const PROJECT_API_KEY = 'phc_mmEpcFgSa7JvAodMzRt65VmsXE4ZaG6xMezCqGxFBe5M';
const API_HOST = 'https://us.i.posthog.com';

export class Analytics {
  private initialized = false;
  private readonly seenSections = new Set<string>();

  /** No-op in dev/localhost so local testing never pollutes real
   *  analytics data -- same guard pattern PostHog's own docs recommend. */
  init(): void {
    if (this.initialized) return;
    if (this.isLocalhost()) return;
    posthog.init(PROJECT_API_KEY, {
      api_host: API_HOST,
      person_profiles: 'identified_only',
      capture_pageview: true,
      autocapture: true,
    });
    this.initialized = true;
  }

  /** Fires once per section per page load (first time a visitor scrolls
   *  into a beat) -- deduped locally so re-scrolling back and forth over
   *  the same section (RevealController re-triggers .is-revealed both
   *  ways) doesn't spam duplicate events. */
  trackSectionViewed(sectionKey: string): void {
    if (!this.initialized) return;
    if (this.seenSections.has(sectionKey)) return;
    this.seenSections.add(sectionKey);
    posthog.capture('section_viewed', { section: sectionKey });
  }

  private isLocalhost(): boolean {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '';
  }
}
