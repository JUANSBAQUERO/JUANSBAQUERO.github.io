import type { StationKey } from '../../domain/entities/Station';
import type { ContentRepository } from '../../domain/repositories/ContentRepository';
import { renderStationBody, renderStationHeader } from '../../application/services/StationContentRenderer';

const SECTION_IDS: Record<StationKey, string> = {
  about: 'sm-about',
  experience: 'sm-experience',
  projects: 'sm-projects',
  skills: 'sm-skills',
  contact: 'sm-contact',
};

const STORAGE_KEY = 'jb_portfolio_mode';

/**
 * Scrollable text-only fallback — used on touch devices (where pointer-lock
 * FPS controls don't work well) and as an explicit "prefer text" option.
 * Renders from the same ContentRepository + rendering service as the 3D
 * panel overlay, so the two views can never drift out of sync.
 */
export class SimpleModeView {
  private readonly container = this.byId('simpleMode');

  constructor(private readonly repository: ContentRepository) {
    this.populate();
  }

  private populate(): void {
    for (const key of Object.keys(SECTION_IDS) as StationKey[]) {
      const sectionEl = document.getElementById(SECTION_IDS[key]);
      if (!sectionEl) continue;
      const data = this.repository.getStationContent(key);
      sectionEl.innerHTML = `${renderStationHeader(data)}${renderStationBody(data)}`;
    }
  }

  show(): void {
    this.container.classList.add('show');
    localStorage.setItem(STORAGE_KEY, 'simple');
  }

  hide(): void {
    this.container.classList.remove('show');
    localStorage.setItem(STORAGE_KEY, '3d');
  }

  onBackTo3D(handler: () => void): void {
    this.byId('backTo3D').addEventListener('click', handler);
  }

  static get storedPreference(): 'simple' | '3d' | null {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'simple' || v === '3d' ? v : null;
  }

  static get isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private byId(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`SimpleModeView: missing #${id} in DOM`);
    return el;
  }
}
