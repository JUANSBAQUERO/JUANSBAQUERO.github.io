import { StaticContentRepository } from './infrastructure/content/StaticContentRepository';
import { CharacterScene } from './infrastructure/three/CharacterScene';
import { SmoothScroll } from './infrastructure/scroll/SmoothScroll';
import { NavPillView } from './presentation/nav/NavPillView';
import { computeActiveSectionKey, type ScrollSection } from './application/services/ScrollSpy';
import {
  renderAboutIdentity,
  renderAboutParagraphs,
  renderContactRows,
  renderExperienceList,
  renderProjectCards,
  renderSkillGroups,
} from './application/services/StationContentRenderer';
import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ProjectsContent,
  SkillsContent,
  StationKey,
} from './domain/entities/Station';

const SECTION_KEYS: readonly StationKey[] = ['about', 'experience', 'projects', 'skills', 'contact'];

/**
 * Composition root for the scroll-narrative portfolio: wires the content
 * repository, the fixed 3D character, the floating nav pill, and scroll-spy
 * together. This is the only file allowed to know about every layer at once.
 */
function bootstrap(): void {
  const stageEl = document.getElementById('character-stage');
  if (!stageEl) throw new Error('#character-stage root element missing');

  const content = new StaticContentRepository();
  const scene = new CharacterScene(stageEl);
  const nav = new NavPillView();
  const smoothScroll = new SmoothScroll();

  populateContent(content);

  nav.onNavigate = (key) => {
    const target = document.getElementById(`section-${key}`);
    if (target) smoothScroll.scrollTo(target);
  };

  const sectionEls = SECTION_KEYS.map((key) => document.getElementById(`section-${key}`)).filter(
    (el): el is HTMLElement => el !== null,
  );

  let activeKey: StationKey | null = null;
  let hasRunOnce = false;

  function updateActiveSection(): void {
    const sections: ScrollSection[] = sectionEls.map((el) => ({
      key: (el.dataset.station ?? '') as string,
      top: el.offsetTop,
      height: el.offsetHeight,
    }));
    const nextKey = computeActiveSectionKey(
      sections,
      window.scrollY,
      window.innerHeight,
    ) as StationKey | null;
    if (nextKey !== activeKey || !hasRunOnce) {
      hasRunOnce = true;
      activeKey = nextKey;
      nav.setActive(activeKey);
      scene.setActiveStation(activeKey);
      document.body.classList.toggle('is-hero', activeKey === null);
      document.body.classList.toggle('is-projects', activeKey === 'projects');
    }
  }

  window.addEventListener('resize', updateActiveSection);
  smoothScroll.onScroll(updateActiveSection);

  scene.start();
  smoothScroll.start();
  updateActiveSection();
}

function populateContent(content: StaticContentRepository): void {
  const about = content.getStationContent('about') as AboutContent;
  const experience = content.getStationContent('experience') as ExperienceContent;
  const projects = content.getStationContent('projects') as ProjectsContent;
  const skills = content.getStationContent('skills') as SkillsContent;
  const contact = content.getStationContent('contact') as ContactContent;

  setHtml('tcAboutName', renderAboutIdentity('Juan Sebastián', 'Senior Full Stack Developer'));
  setHtml('tcAboutBody', renderAboutParagraphs(about));
  setHtml('experienceList', renderExperienceList(experience));
  setHtml('projectsGrid', renderProjectCards(projects));
  setHtml('skillsList', renderSkillGroups(skills));
  setHtml('contactList', renderContactRows(contact));
}

function setHtml(id: string, html: string): void {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

bootstrap();
