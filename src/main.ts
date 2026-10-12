import { JourneyScene } from './infrastructure/three/JourneyScene';
import { SmoothScroll } from './infrastructure/scroll/SmoothScroll';
import { NavPillView } from './presentation/nav/NavPillView';
import {
  computeActiveBeatId,
  computeCharacterPosition,
  computeGlobalProgress,
  type BeatBounds,
} from './application/services/JourneyProgress';
import {
  renderAboutIdentity,
  renderAboutParagraphs,
  renderContactRows,
  renderExperienceList,
  renderProjectCards,
  renderSkillGroups,
} from './application/services/StationContentRenderer';
import { resolveInitialLocale, LocalePreference } from './application/services/LocalePreference';
import { SUPPORTED_LOCALES, type Locale } from './domain/entities/Locale';
import type { StationKey } from './domain/entities/Station';
import { journeyBeats, journeyScenes } from '../content/journey';
import { getLocaleContent } from '../content/locales/index';
import { LegalModal } from './presentation/legal/LegalModal';

/** Beat ids that map 1:1 onto the old StationKey nav items -- everything
 *  the nav pill links to still exists as a beat, just inside the new
 *  journey scroll instead of a standalone <section>. */
const NAV_BEAT_IDS: readonly StationKey[] = ['about', 'experience', 'projects', 'skills', 'contact'];

/**
 * Composition root for the horizontal "journey" narrative: the character
 * walks/runs/crashes/bows across a fixed full-viewport 3D stage while the
 * visitor scrolls past a vertical stack of content beats layered on top
 * (see JourneyProgress.ts for the pure scroll -> {scene, x} math this
 * wires up every scroll frame).
 *
 * Also owns the language switcher: `applyLocale` re-renders every text
 * node from the chosen locale's content without touching the Three.js
 * scene, scroll state, or beat layout -- switching language never causes
 * a page reload or loses scroll position.
 */
function bootstrap(): void {
  const stageEl = document.getElementById('journey-stage');
  if (!stageEl) throw new Error('#journey-stage root element missing');
  const loaderEl = document.getElementById('stageLoader');

  const scene = new JourneyScene(stageEl, loaderEl);
  const smoothScroll = new SmoothScroll();

  const localePreference = new LocalePreference();
  const initialLocale = resolveInitialLocale(
    new URLSearchParams(window.location.search).get('lang'),
    localePreference.get(),
    navigator.languages ? Array.from(navigator.languages) : [navigator.language],
  );

  const nav = new NavPillView(getLocaleContent(initialLocale).ui.nav);
  const legalModal = new LegalModal();
  let currentLocale: Locale = initialLocale;

  applyLocale(currentLocale, nav, legalModal);
  setupLocaleSwitcher((locale) => {
    if (locale === currentLocale) return;
    currentLocale = locale;
    localePreference.set(locale);
    applyLocale(locale, nav, legalModal);
  });

  document.getElementById('legalLink')?.addEventListener('click', () => legalModal.show());
  legalModal.setScrollHooks(
    () => smoothScroll.pause(),
    () => smoothScroll.resume(),
  );

  nav.onNavigate = (key) => {
    const target = document.getElementById(`beat-${key}`);
    if (target) smoothScroll.scrollTo(scrollTargetFor(target));
  };

  const navCta = document.getElementById('navCta');
  navCta?.addEventListener('click', () => {
    const target = document.getElementById('beat-contact');
    if (target) smoothScroll.scrollTo(scrollTargetFor(target));
  });

  const beatEls = journeyBeats
    .map((beat) => document.getElementById(`beat-${beat.id}`))
    .filter((el): el is HTMLElement => el !== null);

  /** Nav/CTA clicks must land a bit PAST the beat's top edge, not exactly
   *  on it -- landing exactly on a beat boundary makes the trigger-line
   *  math in computeActiveBeatId (top + viewport * 0.4) ambiguous between
   *  "just entered this beat" and "still the previous one", which showed
   *  up as the character scene flickering between crash/bow when jumping
   *  straight to Contact. Offsetting by a fixed amount into the beat's own
   *  height removes that ambiguity. */
  function scrollTargetFor(el: HTMLElement): number {
    return el.offsetTop + Math.min(120, el.offsetHeight * 0.2);
  }

  let activeBeatId: string | null = null;
  let hasRunOnce = false;

  function updateJourney(): void {
    const bounds: BeatBounds[] = beatEls.map((el) => ({
      id: el.dataset.beat ?? '',
      top: el.offsetTop,
      height: el.offsetHeight,
    }));

    const nextBeatId = computeActiveBeatId(bounds, window.scrollY, window.innerHeight);
    if (nextBeatId !== activeBeatId || !hasRunOnce) {
      hasRunOnce = true;
      activeBeatId = nextBeatId;
      const navKey = NAV_BEAT_IDS.find((k) => k === activeBeatId) ?? null;
      nav.setActive(navKey);
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = computeGlobalProgress(window.scrollY, docHeight);
    const { sceneKey, characterX } = computeCharacterPosition(journeyScenes, journeyBeats, progress);
    const activeScene = journeyScenes.find((s) => s.key === sceneKey) ?? journeyScenes[0];
    scene.setPosition(activeScene, characterX);
  }

  window.addEventListener('resize', updateJourney);
  smoothScroll.onScroll(updateJourney);

  scene.start();
  smoothScroll.start();
  updateJourney();
}

/** Re-renders every localized text node (nav, hero, section headings,
 *  station content) for the given locale -- the Three.js scene, scroll
 *  position, and active-beat tracking are untouched by a language switch. */
function applyLocale(locale: Locale, nav: NavPillView, legalModal: LegalModal): void {
  const content = getLocaleContent(locale);
  document.documentElement.lang = locale;

  nav.setLabels(content.ui.nav);

  const navCta = document.getElementById('navCta');
  if (navCta) navCta.textContent = content.ui.cta;

  setText('heroEyebrow', content.ui.hero.eyebrow);
  setHtml('heroGreeting', `${content.ui.hero.greetingPrefix}<span>${content.ui.hero.name}</span>`);
  setText('heroSubtitle', content.ui.hero.subtitle);
  setText('heroBody', content.ui.hero.body);
  setText('heroScrollHint', content.ui.hero.scrollHint);

  setText('aboutTag', content.ui.aboutTag);
  setHtml('tcAboutName', renderAboutIdentity('Juan Sebastián', content.ui.aboutRole));
  setHtml('tcAboutBody', renderAboutParagraphs(content.about));

  setText('experienceTag', content.ui.experienceTag);
  setText('experienceHeading', content.ui.experienceHeading);
  setHtml('experienceList', renderExperienceList(content.experience));

  setText('projectsTag', content.ui.projectsTag);
  setText('projectsHeading', content.ui.projectsHeading);
  setHtml('projectsGrid', renderProjectCards(content.projects));

  setText('skillsTag', content.ui.skillsTag);
  setText('skillsHeading', content.ui.skillsHeading);
  setHtml('skillsList', renderSkillGroups(content.skills));

  setText('contactHeading', content.ui.contactHeading);
  setHtml('contactList', renderContactRows(content.contact));

  setText('legalLink', content.ui.footerLegalLink);
  legalModal.setContent(content.legal);

  updateLocaleSwitcherActiveState(locale);
}

function setupLocaleSwitcher(onSelect: (locale: Locale) => void): void {
  const root = document.getElementById('localeSwitcher');
  if (!root) return;
  for (const btn of root.querySelectorAll<HTMLButtonElement>('.locale-switcher__item')) {
    const locale = btn.dataset.locale;
    if (!locale || !(SUPPORTED_LOCALES as readonly string[]).includes(locale)) continue;
    btn.addEventListener('click', () => onSelect(locale as Locale));
  }
}

function updateLocaleSwitcherActiveState(locale: Locale): void {
  const root = document.getElementById('localeSwitcher');
  if (!root) return;
  for (const btn of root.querySelectorAll<HTMLButtonElement>('.locale-switcher__item')) {
    btn.classList.toggle('is-active', btn.dataset.locale === locale);
  }
}

function setText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHtml(id: string, html: string): void {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

bootstrap();
