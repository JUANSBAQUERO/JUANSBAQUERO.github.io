import { describe, expect, it, vi } from 'vitest';
import { RevealController } from '../../../src/presentation/scroll/RevealController';

/** Minimal fake standing in for a real DOM Element -- the project's vitest
 *  environment is 'node' (no jsdom), and RevealController only ever touches
 *  `.classList.toggle/add/contains`, so a tiny Set-backed stub is enough to
 *  exercise the real logic without adding a jsdom dependency. */
function createFakeElement() {
  const classes = new Set<string>();
  return {
    classList: {
      toggle: (name: string, force?: boolean) => {
        const shouldHave = force ?? !classes.has(name);
        if (shouldHave) classes.add(name);
        else classes.delete(name);
      },
      add: (name: string) => classes.add(name),
      contains: (name: string) => classes.has(name),
    },
  } as unknown as Element;
}

/** Minimal fake standing in for the real IntersectionObserver (not
 *  available outside a browser/jsdom environment) -- captures the callback
 *  passed by the controller and exposes a way to synthesize entries. */
function createFakeObserverFactory() {
  let capturedCallback: IntersectionObserverCallback | null = null;
  const observed: Element[] = [];

  const factory = vi.fn((callback: IntersectionObserverCallback) => {
    capturedCallback = callback;
    return {
      observe: (el: Element) => observed.push(el),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: () => [],
      root: null,
      rootMargin: '',
      thresholds: [],
    } as unknown as IntersectionObserver;
  });

  return {
    factory,
    observed,
    fire: (entries: Array<{ target: Element; isIntersecting: boolean }>) => {
      capturedCallback?.(entries as IntersectionObserverEntry[], {} as IntersectionObserver);
    },
  };
}

describe('RevealController', () => {
  it('observes every target element passed in', () => {
    const a = createFakeElement();
    const b = createFakeElement();
    const { factory, observed } = createFakeObserverFactory();

    new RevealController([a, b], factory).start();

    expect(observed).toEqual([a, b]);
  });

  it('adds is-revealed when a target enters the viewport', () => {
    const el = createFakeElement();
    const { factory, fire } = createFakeObserverFactory();

    new RevealController([el], factory).start();
    fire([{ target: el, isIntersecting: true }]);

    expect(el.classList.contains('is-revealed')).toBe(true);
  });

  it('removes is-revealed when a target leaves the viewport (re-triggerable, not one-shot)', () => {
    const el = createFakeElement();
    const { factory, fire } = createFakeObserverFactory();

    new RevealController([el], factory).start();
    fire([{ target: el, isIntersecting: true }]);
    fire([{ target: el, isIntersecting: false }]);

    expect(el.classList.contains('is-revealed')).toBe(false);
  });

  it('re-adds is-revealed on a later re-entry (scroll back down after scrolling up)', () => {
    const el = createFakeElement();
    const { factory, fire } = createFakeObserverFactory();

    new RevealController([el], factory).start();
    fire([{ target: el, isIntersecting: true }]);
    fire([{ target: el, isIntersecting: false }]);
    fire([{ target: el, isIntersecting: true }]);

    expect(el.classList.contains('is-revealed')).toBe(true);
  });

  describe('revealAllImmediately', () => {
    it('marks every target revealed without needing an observer (prefers-reduced-motion path)', () => {
      const a = createFakeElement();
      const b = createFakeElement();

      RevealController.revealAllImmediately([a, b]);

      expect(a.classList.contains('is-revealed')).toBe(true);
      expect(b.classList.contains('is-revealed')).toBe(true);
    });
  });
});
