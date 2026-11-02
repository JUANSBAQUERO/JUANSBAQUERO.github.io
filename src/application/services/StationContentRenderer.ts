import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  LabContent,
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
  return `${name}<div class="tc-role">${role}</div>`;
}

export function renderExperienceList(content: ExperienceContent): string {
  return content.jobs
    .map(
      (job, i) => `
      <div class="job" style="--stagger-index:${i}">
        <h3>${job.role} — ${job.org}</h3>
        <div class="meta">${job.period}</div>
        <p>${job.summary}</p>
        <div class="tags">${job.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`,
    )
    .join('');
}

const PROJECT_TILE_COLORS = ['#FF5FA2', '#F4C95D', '#FF8A3D'];

/** Each card is a real <button>, not a static <div> -- clicking it opens
 *  the project detail modal (wired in main.ts via data-project-index), so
 *  "the card goes somewhere" even for client work with no public demo. A
 *  small hint row signals that explicitly instead of leaving a dead-end
 *  looking tile. */
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
      <button type="button" class="proj-card" data-project-index="${i}" style="--stagger-index:${i}">
        <div class="proj-tile" style="--tile-color:${tileColor}"><span>${initials}</span></div>
        <div class="org">${p.org}</div>
        <h4>${p.title}</h4>
        <p>${p.summary}</p>
        <div class="proj-card__hint">${p.downloadHref ? '↓ Case study + download' : '→ View case study'}</div>
      </button>`;
    })
    .join('');
}

export function renderSkillGroups(content: SkillsContent): string {
  return content.groups
    .map(
      (g, i) => `
      <div class="skill-group" style="--stagger-index:${i}"><h4>${g.title}</h4><div class="tags">${g.skills
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

export function renderLabEntries(content: LabContent): string {
  return content.entries
    .map(
      (entry, i) => `
      <div class="lab-entry" style="--stagger-index:${i}">
        <div class="lab-entry__date">${entry.date}</div>
        <h4>${entry.title}</h4>
        <p>${entry.summary}</p>
      </div>`,
    )
    .join('');
}

/** wa.me deep link: phone MUST be E.164 digits only (no "+", spaces or
 *  dashes) per WhatsApp's own click-to-chat spec, and the prefilled
 *  message is query-encoded so quotes/accents/emoji in it never break
 *  the URL. Pure function (no DOM) so it's unit-testable without jsdom,
 *  same pattern as every other renderer in this file. */
export function buildWhatsappHref(phoneE164Digits: string, message: string): string {
  return `https://wa.me/${phoneE164Digits}?text=${encodeURIComponent(message)}`;
}
