import { StaticContentRepository } from "./infrastructure/content/StaticContentRepository";
import { PortfolioScene } from "./infrastructure/three/PortfolioScene";
import { HudView } from "./presentation/hud/HudView";
import { PanelView } from "./presentation/panels/PanelView";
import { SimpleModeView } from "./presentation/panels/SimpleModeView";

/**
 * Composition root. Wires the content repository (domain port), the 3D
 * engine (infrastructure) and the DOM views (presentation) together.
 * This is the ONLY file in the app allowed to know about every layer at
 * once — everything else depends on abstractions, not on this file.
 */
function bootstrap(): void {
  const appEl = document.getElementById("app");
  if (!appEl) throw new Error("#app root element missing");

  const content = new StaticContentRepository();
  const hud = new HudView();
  const panel = new PanelView(content);
  const simpleMode = new SimpleModeView(content);
  let isPanelOpen = false;

  const closePanel = (): void => {
    panel.close();
    isPanelOpen = false;
    scene.setPanelOpen(false);
    scene.lock();
  };

  const scene = new PortfolioScene(appEl, content, {
    onLock: () => hud.setLocked(true),
    onUnlock: () => {
      hud.setLocked(false);
      if (!isPanelOpen) hud.showStartScreen();
    },
    onProximityChange: (_key, title) => hud.setProximityPrompt(title),
    onInteract: (key) => {
      isPanelOpen = true;
      panel.open(key);
    },
    onEscape: () => closePanel(),
  });

  panel.onCloseRequested = () => closePanel();

  hud.onEnter(() => {
    hud.hideStartScreen();
    scene.lock();
  });

  hud.onRequestSimpleMode(() => {
    hud.hideStartScreen();
    simpleMode.show();
  });

  simpleMode.onBackTo3D(() => {
    simpleMode.hide();
    hud.showToggleButton();
  });

  scene.start();

  // Device + stored-preference defaults: pointer-lock FPS controls don't
  // work well on touch, so default straight to the text fallback there.
  if (SimpleModeView.isTouchDevice) {
    hud.setTouchHint();
  }
  const stored = SimpleModeView.storedPreference;
  if (SimpleModeView.isTouchDevice || stored === "simple") {
    hud.hideStartScreen();
    simpleMode.show();
  }
}

bootstrap();
