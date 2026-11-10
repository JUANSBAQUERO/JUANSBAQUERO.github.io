import { resolveInitialLocale, LocalePreference } from './application/services/LocalePreference';
import { SUPPORTED_LOCALES, type Locale } from './domain/entities/Locale';
import type { LabProjectKey } from './domain/entities/Station';
import { getLocaleContent } from '../content/locales/index';
import {
  filterLabEntriesByProject,
  LAB_PROJECT_LABELS,
  renderLabEntries,
} from './application/services/StationContentRenderer';

/**
 * Composition root for the dedicated /changelog page: a lightweight,
 * static listing of every Lab entry across all personal projects (Stack
 * Rush, Finance OS, this portfolio), reusing the exact same content/
 * data and renderLabEntries() the main 3D journey uses for its Lab
 * section -- single source of truth, zero content duplication. This
 * page intentionally never imports Three.js/Lenis/Analytics: it exists
 * so a visitor arriving from a social post sees the full changelog
 * instantly, without the journey's loading screen.
 */
function bootstrap(): void {
  const localePreference = new LocalePreference();
  const initialLocale = resolveInitialLocale(
    new URLSearchParams(window.location.search).get('lang'),
    localePreference.get(),
    navigator.languages ? Array.from(navigator.languages) : [navigator.language],
  );

  let currentLocale: Locale = initialLocale;
  let currentProject: LabProjectKey | 'all' = 'all';

  const render = (): void =>
    applyLocale(currentLocale, currentProject, (project) => {
      currentProject = project;
      render();
    });
  render();

  setupLocaleSwitcher((locale) => {
    if (locale === currentLocale) return;
    currentLocale = locale;
    localePreference.set(locale);
    render();
    updateLocaleSwitcherActiveState(locale);
  });
  updateLocaleSwitcherActiveState(currentLocale);
}

function applyLocale(
  locale: Locale,
  project: LabProjectKey | 'all',
  onProjectSelect: (project: LabProjectKey | 'all') => void,
): void {
  const content = getLocaleContent(locale);
  document.documentElement.lang = locale;

  setText('backLabel', content.ui.backToPortfolio);
  setText('labTag', content.ui.labTag);
  setText('labHeading', content.ui.labHeading);
  setText('labIntro', content.lab.intro);

  const filteredEntries = filterLabEntriesByProject(content.lab.entries, project);
  setHtml('labList', renderLabEntries({ ...content.lab, entries: filteredEntries }));

  renderFilterPills(project, onProjectSelect, locale);
}

function renderFilterPills(
  active: LabProjectKey | 'all',
  onSelect: (project: LabProjectKey | 'all') => void,
  locale?: Locale,
): void {
  const root = document.getElementById('changelogFilter');
  if (!root) return;

  const allLabel = locale ? getLocaleContent(locale).ui.changelogAllFilter : 'All';
  const projects: readonly (LabProjectKey | 'all')[] = [
    'all',
    ...(Object.keys(LAB_PROJECT_LABELS) as LabProjectKey[]),
  ];

  root.innerHTML = projects
    .map((p) => {
      const label = p === 'all' ? allLabel : LAB_PROJECT_LABELS[p];
      const isActive = p === active;
      return `<button type="button" class="changelog-filter__pill${isActive ? ' is-active' : ''}" data-project="${p}">${label}</button>`;
    })
    .join('');

  for (const btn of root.querySelectorAll<HTMLButtonElement>('.changelog-filter__pill')) {
    btn.addEventListener('click', () => onSelect(btn.dataset.project as LabProjectKey | 'all'));
  }
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
