import type { LegalContent } from '../../../content/LocaleContent';

/**
 * Accessible modal dialog for the Privacy & Legal Notice. Rendered once
 * into the DOM, hidden by default, shown/hidden via show()/hide(). Built
 * as its own dialog element (not a <dialog>) for consistent styling
 * control and to support ESC/backdrop-click/focus-trap without relying on
 * native <dialog> quirks across browsers.
 */
export class LegalModal {
  private readonly overlay: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly titleEl: HTMLHeadingElement;
  private readonly updatedEl: HTMLParagraphElement;
  private readonly bodyEl: HTMLDivElement;
  private readonly closeBtn: HTMLButtonElement;
  private lastFocusedBeforeOpen: HTMLElement | null = null;
  private onShow: (() => void) | null = null;
  private onHide: (() => void) | null = null;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'legal-modal-overlay';
    this.overlay.setAttribute('role', 'presentation');
    this.overlay.hidden = true;

    this.panel = document.createElement('div');
    this.panel.className = 'legal-modal';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.tabIndex = -1;
    // Tells Lenis (the page's smooth-scroll library) to ignore touch/wheel
    // gestures that start inside this element entirely, letting the
    // browser's native overflow-y scroll handle them -- see the wheel
    // listener below for why `stopPropagation` alone isn't enough on
    // mobile (Lenis captures touch events on `window`, not via bubbling
    // through this panel, so wheel-only stopPropagation never touched the
    // touch-scroll path and the modal was unscrollable on phones).
    this.panel.setAttribute('data-lenis-prevent', '');

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'legal-modal__close';
    this.closeBtn.type = 'button';
    this.closeBtn.setAttribute('aria-label', 'Close');
    this.closeBtn.textContent = '✕';
    this.closeBtn.addEventListener('click', () => this.hide());

    this.titleEl = document.createElement('h2');
    this.titleEl.className = 'legal-modal__title';
    const titleId = 'legalModalTitle';
    this.titleEl.id = titleId;
    this.panel.setAttribute('aria-labelledby', titleId);

    this.updatedEl = document.createElement('p');
    this.updatedEl.className = 'legal-modal__updated';

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'legal-modal__body';

    this.panel.append(this.closeBtn, this.titleEl, this.updatedEl, this.bodyEl);
    this.overlay.appendChild(this.panel);
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hide();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.overlay.hidden) this.hide();
    });
    // Lenis (the page's smooth-scroll library) listens for `wheel` on the
    // whole window and intercepts it even while stopped -- it just skips
    // moving window scroll, but the event still never reaches this panel's
    // native overflow-y scroll in the normal way, so wheeling over the
    // modal body did nothing. Stopping propagation here keeps the wheel
    // event local to the panel, where the browser's native scroll handles
    // it correctly.
    this.panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  }

  /** Re-renders the modal's text for the given locale's legal content --
   *  safe to call while the modal is open (e.g. switching language with
   *  the modal already visible) or closed. */
  setContent(content: LegalContent): void {
    this.titleEl.textContent = content.title;
    this.updatedEl.textContent = content.lastUpdated;
    this.closeBtn.setAttribute('aria-label', content.closeLabel);

    this.bodyEl.innerHTML = content.sections
      .map(
        (section) => `
        <h3>${escapeHtml(section.heading)}</h3>
        ${section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      `,
      )
      .join('');
  }

  /** Registers callbacks run when the modal opens/closes -- used by the
   *  caller to pause/resume the page's Lenis smooth-scroll instance so it
   *  doesn't fight the modal body's native overflow-y scroll while open
   *  (see SmoothScroll.pause/resume). */
  setScrollHooks(onShow: () => void, onHide: () => void): void {
    this.onShow = onShow;
    this.onHide = onHide;
  }

  show(): void {
    this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
    this.overlay.hidden = false;
    // Defer focus to next frame so the element is laid out/visible first
    // (focusing a just-unhidden element synchronously is unreliable in
    // some browsers).
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

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
