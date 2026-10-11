import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ProjectsContent,
  SkillsContent,
} from '../../domain/entities/Station';

/**
 * Pure functions: domain content -> HTML markup fragments. No DOM access,
 * no Three.js — only string templating, so every renderer here is trivially
 * unit-testable and reusable by any layout that wants to show this content.
 *
 * Each renderer returns the INNER fragment only (no outer wrapper div) so
 * callers can place it inside whatever container their layout needs.
 */

export function renderAboutParagraphs(content: AboutContent): string {
  return content.paragraphs.map((p) => `<p>${p}</p>`).join('');
}

export function renderAboutIdentity(name: string, role: string): string {
  return `<div class="tc-name">${name}</div><div class="tc-role">${role}</div>`;
}

export function renderExperienceList(content: ExperienceContent): string {
  return content.jobs
    .map(
      (job) => `
      <div class="job">
        <h3>${job.role} — ${job.org}</h3>
        <div class="meta">${job.period}</div>
        <p>${job.summary}</p>
        <div class="tags">${job.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`,
    )
    .join('');
}

const PROJECT_TILE_COLORS = ['#FF4CD6', '#4CF3FF', '#FFC24C', '#7CFF4C', '#9B6CFF', '#FF6C4C'];

export function renderProjectCards(content: ProjectsContent): string {
  return content.projects
    .map((p, i) => {
      const tileColor = PROJECT_TILE_COLORS[i % PROJECT_TILE_COLORS.length];
      const initials = p.title
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return `
      <div class="proj-card">
        <div class="proj-tile" style="--tile-color:${tileColor}"><span>${initials}</span></div>
        <div class="org">${p.org}</div>
        <h4>${p.title}</h4>
        <p>${p.summary}</p>
      </div>`;
    })
    .join('');
}

export function renderSkillGroups(content: SkillsContent): string {
  return content.groups
    .map(
      (g) => `
      <div class="skill-group"><h4>${g.title}</h4><div class="tags">${g.skills
        .map((s) => `<span class="tag">${s}</span>`)
        .join('')}</div></div>`,
    )
    .join('');
}

export function renderContactRows(content: ContactContent): string {
  const rows = content.links
    .map((link) => {
      const inner = link.href
        ? `<a href="${link.href}" target="${link.href.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${link.label}</a>`
        : `<span>${link.label}</span>`;
      return `<div class="contact-row"><span class="ico">${link.icon}</span>${inner}</div>`;
    })
    .join('');
  return `${rows}<p class="contact-note">${content.note}</p>`;
}
