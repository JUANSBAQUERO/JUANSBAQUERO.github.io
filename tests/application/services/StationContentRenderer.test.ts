import { describe, expect, it } from 'vitest';
import {
  renderAboutIdentity,
  renderAboutParagraphs,
  renderContactRows,
  renderExperienceList,
  renderLabEntries,
  renderProjectCards,
  renderSkillGroups,
  buildWhatsappHref,
  filterLabEntriesByProject,
  LAB_PROJECT_LABELS,
} from '../../../src/application/services/StationContentRenderer';
import {
  aboutContent,
  contactContent,
  experienceContent,
  projectsContent,
  skillsContent,
} from '../../../content/portfolio';
import type { LabContent, LabEntry } from '../../../src/domain/entities/Station';

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

  describe('buildWhatsappHref', () => {
    it('builds a wa.me link with the phone digits and URL-encoded message', () => {
      const href = buildWhatsappHref('573214915457', 'Hi Juan! Let\u2019s talk.');
      expect(href).toBe('https://wa.me/573214915457?text=Hi%20Juan!%20Let%E2%80%99s%20talk.');
    });

    it('URL-encodes accents, quotes and emoji so the link never breaks', () => {
      const href = buildWhatsappHref('573214915457', '\u00a1Hola Juan! \u00bfVi tu portafolio?');
      expect(href).toContain('https://wa.me/573214915457?text=');
      // decodeURIComponent round-trips exactly back to the original message.
      const query = href.split('?text=')[1];
      expect(decodeURIComponent(query)).toBe('\u00a1Hola Juan! \u00bfVi tu portafolio?');
    });
  });

  const labEntries: readonly LabEntry[] = [
    { date: 'Nov 2026', title: 'Stack Rush entry', summary: 'summary one', project: 'stack-rush' },
    { date: 'Nov 2026', title: 'Portfolio entry', summary: 'summary two', project: 'portfolio' },
    { date: '2026', title: 'Finance OS entry', summary: 'summary three', project: 'finance-os' },
  ];
  const labContent: LabContent = {
    key: 'lab',
    accentHex: '#FF8A3D',
    eyebrow: 'Right now',
    title: "What I'm poking at lately",
    intro: 'intro text',
    entries: labEntries,
  };

  describe('renderLabEntries', () => {
    it('renders one .lab-entry block per entry with date, title, summary and project label', () => {
      const html = renderLabEntries(labContent);
      const entryCount = (html.match(/class="lab-entry"/g) ?? []).length;
      expect(entryCount).toBe(labEntries.length);

      for (const entry of labEntries) {
        expect(html).toContain(entry.date);
        expect(html).toContain(entry.title);
        expect(html).toContain(entry.summary);
        expect(html).toContain(LAB_PROJECT_LABELS[entry.project]);
      }
    });
  });

  describe('filterLabEntriesByProject', () => {
    it("returns every entry unchanged when filtering by 'all'", () => {
      expect(filterLabEntriesByProject(labEntries, 'all')).toEqual(labEntries);
    });

    it('returns only entries matching the given project', () => {
      const filtered = filterLabEntriesByProject(labEntries, 'stack-rush');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Stack Rush entry');
    });

    it('returns an empty array when no entry matches the project', () => {
      const noMatches = filterLabEntriesByProject(
        labEntries.filter((e) => e.project !== 'finance-os'),
        'finance-os',
      );
      expect(noMatches).toEqual([]);
    });
  });
});
