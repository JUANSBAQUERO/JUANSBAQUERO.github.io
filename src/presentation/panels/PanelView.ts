import type { StationKey } from '../../domain/entities/Station';
import type { ContentRepository } from '../../domain/repositories/ContentRepository';
import { renderStationBody, renderStationHeader } from '../../application/services/StationContentRenderer';

/**
 * Controls the modal overlay panel shown when the visitor interacts (E) with
 * a pedestal. Depends on the ContentRepository abstraction + the pure
 * rendering service — never touches Three.js.
 */
export class PanelView {
  private readonly overlay = this.byId('panelOverlay');
  private readonly content = this.byId('panelContent');
  private readonly closeBtn = this.byId('panelClose');

  constructor(private readonly repository: ContentRepository) {
    this.closeBtn.addEventListener('click', () => this.onCloseRequested?.());
    this.overlay.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'panelOverlay') this.onCloseRequested?.();
    });
  }

  onCloseRequested: (() => void) | null = null;

  open(key: StationKey): void {
    const data = this.repository.getStationContent(key);
    this.content.innerHTML = `${renderStationHeader(data)}${renderStationBody(data)}`;
    this.overlay.classList.add('show');
  }

  close(): void {
    this.overlay.classList.remove('show');
  }

  private byId(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`PanelView: missing #${id} in DOM`);
    return el;
  }
}
