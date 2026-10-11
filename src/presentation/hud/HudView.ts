/**
 * Thin DOM controller for the heads-up display: crosshair, interaction
 * prompt, start screen and the simple/3D mode toggle button. Owns only
 * element lookups + class toggling — no business logic, no Three.js.
 */
export class HudView {
  private readonly crosshair = this.byId('crosshair');
  private readonly promptEl = this.byId('prompt');
  private readonly promptText = this.byId('promptText');
  private readonly startScreen = this.byId('startScreen');
  private readonly toggleModeBtn = this.byId('toggleModeBtn');
  private readonly enterBtn = this.byId('enterBtn');
  private readonly simpleModeLink = this.byId('simpleModeLink');

  onEnter(handler: () => void): void {
    this.enterBtn.addEventListener('click', handler);
  }

  onRequestSimpleMode(handler: () => void): void {
    this.simpleModeLink.addEventListener('click', handler);
    this.toggleModeBtn.addEventListener('click', handler);
  }

  showStartScreen(): void {
    this.startScreen.style.display = 'flex';
  }

  hideStartScreen(): void {
    this.startScreen.style.display = 'none';
    this.toggleModeBtn.style.display = 'block';
  }

  hideToggleButton(): void {
    this.toggleModeBtn.style.display = 'none';
  }

  showToggleButton(): void {
    this.toggleModeBtn.style.display = 'block';
  }

  setLocked(locked: boolean): void {
    this.crosshair.classList.toggle('active', locked);
  }

  setProximityPrompt(title: string | null): void {
    if (title) {
      this.promptText.textContent = `View ${title}`;
      this.promptEl.classList.add('show');
    } else {
      this.promptEl.classList.remove('show');
    }
  }

  setTouchHint(): void {
    const hint = this.startScreen.querySelector('p');
    if (hint) {
      hint.textContent =
        "This 3D experience is built for desktop (keyboard + mouse). On mobile, here's the text version — or try the 3D mode anyway.";
    }
  }

  private byId(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`HudView: missing #${id} in DOM`);
    return el;
  }
}
