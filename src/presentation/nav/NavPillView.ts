import type { StationKey } from '../../domain/entities/Station';

const SECTION_ORDER: readonly StationKey[] = ['about', 'experience', 'projects', 'skills', 'contact'];

/**
 * Floating pill navbar (About / Experience / Projects / Skills / Contact).
 * Pure DOM: highlights the active item and smooth-scrolls to a section on
 * click — never touches Three.js or scroll-spy math directly (the caller
 * wires `onNavigate` to whatever scrolling mechanism it wants).
 *
 * Labels are passed in (not hardcoded) so the same instance can be
 * relabeled in place when the visitor switches language, instead of being
 * torn down and rebuilt (see LocaleController in main.ts).
 */
export class NavPillView {
  private readonly root = this.byId('navPill');
  private readonly toggle = document.getElementById('navToggle') as HTMLButtonElement | null;
  private readonly buttons = new Map<StationKey, HTMLButtonElement>();

  constructor(labels: Record<StationKey, string>) {
    for (const key of SECTION_ORDER) {
      const btn = document.createElement('button');
      btn.className = 'nav-pill__item';
      btn.textContent = labels[key];
      btn.dataset.station = key;
      btn.addEventListener('click', () => {
        this.onNavigate?.(key);
        this.close();
      });
      this.root.appendChild(btn);
      this.buttons.set(key, btn);
    }

    // Mobile-only hamburger: the pill itself is the dropdown, hidden until
    // toggled open (see main.css @media max-width: 680px). Desktop never
    // shows the toggle button, so this listener is simply inert there.
    this.toggle?.addEventListener('click', () => this.toggleOpen());
    document.addEventListener('click', (e) => {
      if (!this.isOpen()) return;
      const target = e.target as Node;
      if (!this.root.contains(target) && !this.toggle?.contains(target)) this.close();
    });
  }

  onNavigate: ((key: StationKey) => void) | null = null;

  setActive(key: StationKey | null): void {
    for (const [btnKey, btn] of this.buttons) {
      btn.classList.toggle('is-active', btnKey === key);
    }
  }

  /** Re-labels the existing buttons in place (keeps their click listeners
   *  and active state) -- called when the visitor switches language. */
  setLabels(labels: Record<StationKey, string>): void {
    for (const [key, btn] of this.buttons) {
      btn.textContent = labels[key];
    }
  }

  private byId(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`NavPillView: missing #${id} in DOM`);
    return el;
  }

  private isOpen(): boolean {
    return this.root.classList.contains('is-open');
  }

  private toggleOpen(): void {
    this.isOpen() ? this.close() : this.open();
  }

  private open(): void {
    this.root.classList.add('is-open');
    this.toggle?.setAttribute('aria-expanded', 'true');
  }

  private close(): void {
    this.root.classList.remove('is-open');
    this.toggle?.setAttribute('aria-expanded', 'false');
  }
}
