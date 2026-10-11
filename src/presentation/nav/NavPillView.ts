import type { StationKey } from '../../domain/entities/Station';

const SECTION_ORDER: readonly StationKey[] = ['about', 'experience', 'projects', 'skills', 'contact'];
const LABELS: Record<StationKey, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  contact: 'Contact',
};

/**
 * Floating pill navbar (About / Experience / Projects / Skills / Contact).
 * Pure DOM: highlights the active item and smooth-scrolls to a section on
 * click — never touches Three.js or scroll-spy math directly (the caller
 * wires `onNavigate` to whatever scrolling mechanism it wants).
 */
export class NavPillView {
  private readonly root = this.byId('navPill');
  private readonly buttons = new Map<StationKey, HTMLButtonElement>();

  constructor() {
    for (const key of SECTION_ORDER) {
      const btn = document.createElement('button');
      btn.className = 'nav-pill__item';
      btn.textContent = LABELS[key];
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

  private byId(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`NavPillView: missing #${id} in DOM`);
    return el;
  }
}
