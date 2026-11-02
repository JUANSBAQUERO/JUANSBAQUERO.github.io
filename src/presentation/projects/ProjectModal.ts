import type { ProjectEntry } from '../../domain/entities/Station';

/**
 * Accessible modal dialog for a single project's case study. Mirrors
 * LegalModal's structure (own overlay, ESC/backdrop-click/focus-trap,
 * Lenis wheel-stopPropagation) rather than reaching for a shared base
 * class -- two modals total don't justify an abstraction yet, and keeping
 * them independent means a change to one's behavior can't silently break
 * the other.
 *
 * This is what answers feedback "cards go nowhere": most project entries
 * are client work with no public demo, so clicking a card opens THIS modal
 * with a longer case-study paragraph + stack tags, and a real download
 * link when one exists (e.g. the FinanceOS build playbook) instead of a
 * dead link to nothing.
 */
export class ProjectModal {
  private readonly overlay: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly orgEl: HTMLDivElement;
  private readonly titleEl: HTMLHeadingElement;
  private readonly bodyEl: HTMLParagraphElement;
  private readonly stackEl: HTMLDivElement;
  private readonly downloadEl: HTMLAnchorElement;
  private readonly closeBtn: HTMLButtonElement;
  private lastFocusedBeforeOpen: HTMLElement | null = null;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'legal-modal-overlay proj-modal-overlay';
    this.overlay.setAttribute('role', 'presentation');
    this.overlay.hidden = true;

    this.panel = document.createElement('div');
    this.panel.className = 'legal-modal proj-modal';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.tabIndex = -1;
    this.panel.setAttribute('data-lenis-prevent', '');

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'legal-modal__close';
    this.closeBtn.type = 'button';
    this.closeBtn.setAttribute('aria-label', 'Close');
    this.closeBtn.textContent = '✕';
    this.closeBtn.addEventListener('click', () => this.hide());

    this.orgEl = document.createElement('div');
    this.orgEl.className = 'proj-modal__org';

    this.titleEl = document.createElement('h2');
    this.titleEl.className = 'legal-modal__title';
    const titleId = 'projectModalTitle';
    this.titleEl.id = titleId;
    this.panel.setAttribute('aria-labelledby', titleId);

    this.bodyEl = document.createElement('p');
    this.bodyEl.className = 'proj-modal__body';

    this.stackEl = document.createElement('div');
    this.stackEl.className = 'tags proj-modal__stack';

    this.downloadEl = document.createElement('a');
    this.downloadEl.className = 'proj-modal__download';
    this.downloadEl.rel = 'noopener';

    this.panel.append(this.closeBtn, this.orgEl, this.titleEl, this.bodyEl, this.stackEl, this.downloadEl);
    this.overlay.appendChild(this.panel);
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hide();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.overlay.hidden) this.hide();
    });
    this.panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  }

  setScrollHooks(onShow: () => void, onHide: () => void): void {
    this.onShow = onShow;
    this.onHide = onHide;
  }
  private onShow: (() => void) | null = null;
  private onHide: (() => void) | null = null;

  show(project: ProjectEntry): void {
    this.orgEl.textContent = project.org;
    this.titleEl.textContent = project.title;
    this.bodyEl.textContent = project.detail ?? project.summary;

    this.stackEl.innerHTML = (project.stack ?? []).map((s) => `<span class="tag">${s}</span>`).join('');
    this.stackEl.hidden = !project.stack || project.stack.length === 0;

    if (project.downloadHref) {
      this.downloadEl.href = project.downloadHref;
      this.downloadEl.textContent = `⬇ ${project.downloadLabel ?? 'Download'}`;
      const isExternal = /^https?:\/\//.test(project.downloadHref);
      // Same-origin files (our own /downloads/*.md) must force a real
      // download instead of navigating -- browsers render .md as plain
      // text inline by default, so without `download` clicking the link
      // just opens a text preview tab instead of saving anything. Only
      // set it for same-origin assets: the `download` attribute is
      // ignored (and target=_blank is what we want) for cross-origin
      // links, where we don't control the Content-Disposition anyway.
      if (isExternal) {
        this.downloadEl.target = '_blank';
        this.downloadEl.removeAttribute('download');
      } else {
        this.downloadEl.removeAttribute('target');
        this.downloadEl.setAttribute('download', project.downloadHref.split('/').pop() ?? '');
      }
      this.downloadEl.hidden = false;
    } else {
      this.downloadEl.hidden = true;
    }

    this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
    this.overlay.hidden = false;
    requestAnimationFrame(() => this.panel.focus());
    document.body.style.overflow = 'hidden';
    this.onShow?.();
  }

  hide(): void {
    this.overlay.hidden = true;
    document.body.style.overflow = '';
    this.lastFocusedBeforeOpen?.focus();
    this.onHide?.();
  }
}
