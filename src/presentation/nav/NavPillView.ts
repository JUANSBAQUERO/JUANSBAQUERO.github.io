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
  private readonly buttons = new Map<StationKey, HTMLButtonElement>();

  constructor(labels: Record<StationKey, string>) {
    for (const key of SECTION_ORDER) {
      const btn = document.createElement('button');
      btn.className = 'nav-pill__item';
      btn.textContent = labels[key];
      btn.dataset.station = key;
      btn.addEventListener('click', () => this.onNavigate?.(key));
      this.root.appendChild(btn);
      this.buttons.set(key, btn);
    }
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
}
