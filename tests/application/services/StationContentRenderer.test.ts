import { describe, expect, it } from 'vitest';
import {
  renderAboutIdentity,
  renderAboutParagraphs,
  renderContactRows,
  renderExperienceList,
  renderProjectCards,
  renderSkillGroups,
} from '../../../src/application/services/StationContentRenderer';
import {
  aboutContent,
  contactContent,
  experienceContent,
  projectsContent,
  skillsContent,
} from '../../../content/portfolio';

describe('StationContentRenderer', () => {
  describe('renderAboutIdentity', () => {
    it('renders the given name and role', () => {
      const html = renderAboutIdentity('Juan Sebastián', 'Senior Full Stack Developer');
      expect(html).toContain('Juan Sebastián');
      expect(html).toContain('Senior Full Stack Developer');
    });
  });

  describe('renderAboutParagraphs', () => {
    it('renders every paragraph wrapped in <p>', () => {
      const html = renderAboutParagraphs(aboutContent);
      for (const paragraph of aboutContent.paragraphs) {
        expect(html).toContain(`<p>${paragraph}</p>`);
      }
    });
  });

  describe('renderExperienceList', () => {
    it('renders every job with role, org, period, summary and all tags', () => {
      const html = renderExperienceList(experienceContent);
      for (const job of experienceContent.jobs) {
        expect(html).toContain(job.role);
        expect(html).toContain(job.org);
        expect(html).toContain(job.period);
        expect(html).toContain(job.summary);
        for (const tag of job.tags) {
          expect(html).toContain(`<span class="tag">${tag}</span>`);
        }
      }
    });

    it('renders one .job block per job entry (no entries dropped)', () => {
      const html = renderExperienceList(experienceContent);
      const jobBlockCount = (html.match(/class="job"/g) ?? []).length;
      expect(jobBlockCount).toBe(experienceContent.jobs.length);
    });
  });

  describe('renderProjectCards', () => {
    it('renders one project card per project, with org/title/summary', () => {
      const html = renderProjectCards(projectsContent);
      const cardCount = (html.match(/class="proj-card"/g) ?? []).length;
      expect(cardCount).toBe(projectsContent.projects.length);

      for (const project of projectsContent.projects) {
        expect(html).toContain(project.org);
        expect(html).toContain(project.title);
        expect(html).toContain(project.summary);
      }
    });

    it('renders one color tile per project, cycling through the fixed palette', () => {
      const html = renderProjectCards(projectsContent);
      const tileCount = (html.match(/class="proj-tile"/g) ?? []).length;
      expect(tileCount).toBe(projectsContent.projects.length);
      const colorDeclarations = html.match(/--tile-color:#[0-9A-Fa-f]{6}/g) ?? [];
      expect(colorDeclarations).toHaveLength(projectsContent.projects.length);
    });
  });

  describe('renderSkillGroups', () => {
    it('renders every skill group with its title and all skills as tags', () => {
      const html = renderSkillGroups(skillsContent);
      for (const group of skillsContent.groups) {
        expect(html).toContain(group.title);
        for (const skill of group.skills) {
          expect(html).toContain(`<span class="tag">${skill}</span>`);
        }
      }
    });
  });

  describe('renderContactRows', () => {
    it('renders mailto/http links with the right target, and plain text for href-less links', () => {
      const html = renderContactRows(contactContent);

      const email = contactContent.links.find((l) => l.href?.startsWith('mailto:'));
      expect(email).toBeDefined();
      expect(html).toContain(`href="${email!.href}"`);
      expect(html).toContain(`target="_self"`);

      const linkedIn = contactContent.links.find((l) => l.href?.startsWith('http'));
      expect(linkedIn).toBeDefined();
      expect(html).toContain(`href="${linkedIn!.href}"`);
      expect(html).toContain(`target="_blank"`);

      const plainText = contactContent.links.find((l) => !l.href);
      expect(plainText).toBeDefined();
      expect(html).toContain(plainText!.label);

      expect(html).toContain(contactContent.note);
    });
  });
});
