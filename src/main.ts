import { JourneyScene } from './infrastructure/three/JourneyScene';
import { SmoothScroll } from './infrastructure/scroll/SmoothScroll';
import { NavPillView } from './presentation/nav/NavPillView';
import { RevealController } from './presentation/scroll/RevealController';
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
  renderLabEntries,
  renderProjectCards,
  renderSkillGroups,
  buildWhatsappHref,
} from './application/services/StationContentRenderer';
import { wrapLastWordAccent } from './application/services/EditorialAccent';
import { resolveInitialLocale, LocalePreference } from './application/services/LocalePreference';
import { SUPPORTED_LOCALES, type Locale } from './domain/entities/Locale';
import type { StationKey } from './domain/entities/Station';
import { journeyBeats, journeyScenes } from '../content/journey';
import { WHATSAPP_PHONE_E164 } from '../content/portfolio';
import { getLocaleContent } from '../content/locales/index';
import { LegalModal } from './presentation/legal/LegalModal';
import { ProjectModal } from './presentation/projects/ProjectModal';
import { Analytics } from './infrastructure/analytics/Analytics';

/** Beat ids that map 1:1 onto the old StationKey nav items -- everything
 *  the nav pill links to still exists as a beat, just inside the new
 *  journey scroll instead of a standalone <section>. */
const NAV_BEAT_IDS: readonly StationKey[] = ['about', 'experience', 'projects', 'lab', 'skills', 'contact'];

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
  const speechBubbleEl = document.getElementById('stageSpeechBubble');

  const scene = new JourneyScene(stageEl, loaderEl);
  const smoothScroll = new SmoothScroll();
  const analytics = new Analytics();
  analytics.init();

  const localePreference = new LocalePreference();
  const initialLocale = resolveInitialLocale(
    new URLSearchParams(window.location.search).get('lang'),
    localePreference.get(),
    navigator.languages ? Array.from(navigator.languages) : [navigator.language],
  );

  const nav = new NavPillView(getLocaleContent(initialLocale).ui.nav);
  const legalModal = new LegalModal();
  const projectModal = new ProjectModal();
  projectModal.setScrollHooks(
    () => smoothScroll.pause(),
    () => smoothScroll.resume(),
  );
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

  // Project cards are re-rendered wholesale on every locale switch (see
  // applyLocale -> setHtml('projectsGrid', ...)), so binding a click
  // listener per-card at render time would need re-wiring on every
  // language change. Delegate from the stable grid container instead --
  // it survives innerHTML replacement because the container itself is
  // never replaced, only its children.
  document.getElementById('projectsGrid')?.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-project-index]');
    if (!card) return;
    const index = Number(card.dataset.projectIndex);
    const project = getLocaleContent(currentLocale).projects.projects[index];
    if (project) projectModal.show(project);
  });

  // Click easter egg: clicking the character shows a short speech-bubble
  // reaction, picked at random from the current locale's lines but never
  // repeating the same one twice in a row (a visitor clicking rapidly
  // should see variety, not the same line stuck on screen).
  let lastReactionIndex = -1;
  let speechBubbleFadeTimer = 0;
  let speechBubbleHideTimer = 0;
  scene.onCharacterClick = () => {
    dismissClickHint();
    if (!speechBubbleEl) return;
    const reactions = getLocaleContent(currentLocale).ui.characterReactions;
    if (reactions.length === 0) return;
    let index = Math.floor(Math.random() * reactions.length);
    if (reactions.length > 1 && index === lastReactionIndex) {
      index = (index + 1) % reactions.length;
    }
    lastReactionIndex = index;

    speechBubbleEl.textContent = reactions[index];
    speechBubbleEl.hidden = false;
    speechBubbleEl.classList.remove('is-visible');
    // Force a reflow so re-adding the class restarts the CSS transition
    // even when a previous bubble's fade-out is still mid-flight.
    void speechBubbleEl.offsetWidth;
    speechBubbleEl.classList.add('is-visible');

    // Both timers from any PREVIOUS click must be cancelled here, not just
    // the outer one -- a rapid re-click used to leave the inner "set
    // hidden=true" timeout alive from the earlier click, which then fired
    // ~250ms later and hid the bubble this new click had just re-shown
    // (a stale-timer race found in review). Tracking and clearing both
    // timer ids closes that window.
    window.clearTimeout(speechBubbleFadeTimer);
    window.clearTimeout(speechBubbleHideTimer);
    speechBubbleFadeTimer = window.setTimeout(() => {
      speechBubbleEl.classList.remove('is-visible');
      speechBubbleHideTimer = window.setTimeout(() => {
        speechBubbleEl.hidden = true;
      }, 250);
    }, 2200);
  };

  // One-time "click him" teaser badge -- shown a few seconds after load
  // so it doesn't compete with the hero text for attention, dismissed
  // permanently (localStorage) the first time a visitor sees it, whether
  // they click the character or just scroll past.
  const CLICK_HINT_SEEN_KEY = 'portfolio-click-hint-seen';
  const clickHintEl = document.getElementById('stageClickHint');
  function dismissClickHint(): void {
    if (!clickHintEl) return;
    clickHintEl.classList.remove('is-visible');
    try {
      localStorage.setItem(CLICK_HINT_SEEN_KEY, '1');
    } catch {
      // private browsing / storage disabled -- hint just reappears next load
    }
  }
  let clickHintSeen = false;
  try {
    clickHintSeen = localStorage.getItem(CLICK_HINT_SEEN_KEY) === '1';
  } catch {
    clickHintSeen = false;
  }
  if (clickHintEl && !clickHintSeen) {
    window.setTimeout(() => {
      clickHintEl.hidden = false;
      requestAnimationFrame(() => clickHintEl.classList.add('is-visible'));
    }, 3000);
    window.addEventListener('scroll', dismissClickHint, { once: true, passive: true });
  }

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
      if (activeBeatId) analytics.trackSectionViewed(activeBeatId);
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

  // Beat-card entrance/exit animations (not a totally static page, see
  // RevealController) -- respects prefers-reduced-motion by skipping the
  // observer entirely and marking every card revealed immediately instead
  // of leaving them permanently hidden for users who opted out of motion.
  const beatCards = document.querySelectorAll('.beat-card');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    RevealController.revealAllImmediately(beatCards);
  } else {
    new RevealController(beatCards).start();
  }
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
  setText('heroAvailability', content.ui.hero.availability);
  setText('heroSubtitle', content.ui.hero.subtitle);
  setText('heroBody', content.ui.hero.body);
  setText('heroScrollHint', content.ui.hero.scrollHint);

  setText('aboutTag', content.ui.aboutTag);
  setHtml('tcAboutName', renderAboutIdentity('Juan Sebastián', content.ui.aboutRole));
  setHtml('tcAboutBody', renderAboutParagraphs(content.about));

  setText('experienceTag', content.ui.experienceTag);
  setHtml('experienceHeading', wrapLastWordAccent(content.ui.experienceHeading));
  setHtml('experienceList', renderExperienceList(content.experience));

  setText('projectsTag', content.ui.projectsTag);
  setHtml('projectsHeading', wrapLastWordAccent(content.ui.projectsHeading));
  setHtml('projectsGrid', renderProjectCards(content.projects));

  setText('labTag', content.ui.labTag);
  setHtml('labHeading', wrapLastWordAccent(content.ui.labHeading));
  setText('labIntro', content.lab.intro);
  setHtml('labList', renderLabEntries(content.lab));
  setText('labChangelogLink', content.ui.viewFullChangelog);

  setText('skillsTag', content.ui.skillsTag);
  setHtml('skillsHeading', wrapLastWordAccent(content.ui.skillsHeading));
  setHtml('skillsList', renderSkillGroups(content.skills));

  setHtml('contactHeading', wrapLastWordAccent(content.ui.contactHeading));
  setHtml('contactList', renderContactRows(content.contact));

  setText('legalLink', content.ui.footerLegalLink);
  legalModal.setContent(content.legal);

  setText('stageLoaderCaption', content.ui.stageLoadingCaption);
  setText('stageClickHint', content.ui.characterClickHint);

  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    whatsappFloat.setAttribute('href', buildWhatsappHref(WHATSAPP_PHONE_E164, content.ui.whatsappMessage));
    whatsappFloat.setAttribute('aria-label', content.ui.whatsappLabel);
  }

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
