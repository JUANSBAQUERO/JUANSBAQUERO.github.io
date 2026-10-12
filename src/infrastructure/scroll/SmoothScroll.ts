import Lenis from 'lenis';

/**
 * Thin wrapper around Lenis smooth-scroll. Keeps its own rAF loop (Lenis
 * needs one tick per frame) and exposes a plain `onScroll` callback so the
 * rest of the app never imports Lenis directly — only this adapter does.
 */
export class SmoothScroll {
  private readonly lenis: Lenis;
  private frameHandle = 0;

  constructor() {
    this.lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });
    this.raf = this.raf.bind(this);
  }

  onScroll(callback: () => void): void {
    this.lenis.on('scroll', callback);
  }

  scrollTo(target: string | HTMLElement | number): void {
    this.lenis.scrollTo(target, { duration: 1.2 });
  }

  /** Pauses Lenis's own wheel/touch capture so an overlay's native
   *  scrollable content (e.g. a modal body with overflow-y: auto) can
   *  receive wheel events normally -- Lenis listens on the whole document
   *  by default, so without this an open modal's internal scroll fights
   *  the page's smooth-scroll underneath it. */
  pause(): void {
    this.lenis.stop();
  }

  resume(): void {
    this.lenis.start();
  }

  start(): void {
    this.frameHandle = requestAnimationFrame(this.raf);
  }

  dispose(): void {
    cancelAnimationFrame(this.frameHandle);
    this.lenis.destroy();
  }

  private raf(time: number): void {
    this.lenis.raf(time);
    this.frameHandle = requestAnimationFrame(this.raf);
  }
}
