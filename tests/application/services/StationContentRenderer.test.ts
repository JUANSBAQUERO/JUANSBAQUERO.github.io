import { describe, expect, it } from 'vitest';
import {
  renderStationBody,
  renderStationHeader,
} from '../../../src/application/services/StationContentRenderer';
import {
  aboutContent,
  contactContent,
  experienceContent,
  projectsContent,
  skillsContent,
} from '../../../content/portfolio';

describe('StationContentRenderer', () => {
  describe('renderStationHeader', () => {
    it('renders the eyebrow, accent color and title for any station', () => {
      const html = renderStationHeader(aboutContent);
      expect(html).toContain(aboutContent.eyebrow);
      expect(html).toContain(aboutContent.title);
      expect(html).toContain(aboutContent.accentHex);
    });
  });

  describe('renderStationBody — about', () => {
    it('renders every paragraph wrapped in <p>', () => {
      const html = renderStationBody(aboutContent);
      for (const paragraph of aboutContent.paragraphs) {
        expect(html).toContain(`<p>${paragraph}</p>`);
      }
    });
  });

  describe('renderStationBody — experience', () => {
    it('renders every job with role, org, period and all tags', () => {
      const html = renderStationBody(experienceContent);
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
      const html = renderStationBody(experienceContent);
      const jobBlockCount = (html.match(/class="job"/g) ?? []).length;
      expect(jobBlockCount).toBe(experienceContent.jobs.length);
    });
  });

  describe('renderStationBody — projects', () => {
    it('renders one project card per project, with org/title/summary', () => {
      const html = renderStationBody(projectsContent);
      const cardCount = (html.match(/class="proj-card"/g) ?? []).length;
      expect(cardCount).toBe(projectsContent.projects.length);

      for (const project of projectsContent.projects) {
        expect(html).toContain(project.org);
        expect(html).toContain(project.title);
        expect(html).toContain(project.summary);
      }
    });
  });

  describe('renderStationBody — skills', () => {
    it('renders every skill group with its title and all skills as tags', () => {
      const html = renderStationBody(skillsContent);
      for (const group of skillsContent.groups) {
        expect(html).toContain(group.title);
        for (const skill of group.skills) {
          expect(html).toContain(`<span class="tag">${skill}</span>`);
        }
      }
    });
  });

  describe('renderStationBody — contact', () => {
    it('renders mailto/http links with the right target, and plain text for href-less links', () => {
      const html = renderStationBody(contactContent);

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
