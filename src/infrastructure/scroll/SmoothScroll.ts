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

  scrollTo(target: string | HTMLElement): void {
    this.lenis.scrollTo(target, { duration: 1.2 });
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
