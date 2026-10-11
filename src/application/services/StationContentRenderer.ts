import type {
  AnyStationContent,
  ContactContent,
  ExperienceContent,
  ProjectsContent,
  SkillsContent,
} from '../../domain/entities/Station';

/**
 * Pure function: domain content -> HTML markup string. No DOM access, no
 * Three.js — only string templating, so it's trivially testable and reusable
 * by both the 3D panel overlay and the simple-mode fallback page.
 */
export function renderStationBody(content: AnyStationContent): string {
  switch (content.key) {
    case 'about':
      return `<div class="panel-body">${content.paragraphs.map((p) => `<p>${p}</p>`).join('\n')}</div>`;

    case 'experience':
      return renderExperience(content);

    case 'projects':
      return renderProjects(content);

    case 'skills':
      return renderSkills(content);

    case 'contact':
      return renderContact(content);

    default:
      return '';
  }
}

function renderExperience(content: ExperienceContent): string {
  const jobs = content.jobs
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
  return `<div class="panel-body">${jobs}</div>`;
}

function renderProjects(content: ProjectsContent): string {
  const cards = content.projects
    .map(
      (p) => `
      <div class="proj-card"><div class="org">${p.org}</div><h4>${p.title}</h4><p>${p.summary}</p></div>`,
    )
    .join('');
  return `<div class="panel-body"><div class="proj-grid">${cards}</div></div>`;
}

function renderSkills(content: SkillsContent): string {
  const groups = content.groups
    .map(
      (g) => `
      <div class="skill-group"><h4>${g.title}</h4><div class="tags">${g.skills
        .map((s) => `<span class="tag">${s}</span>`)
        .join('')}</div></div>`,
    )
    .join('');
  return `<div class="panel-body">${groups}</div>`;
}

function renderContact(content: ContactContent): string {
  const links = content.links
    .map((link) => {
      const inner = link.href
        ? `<a href="${link.href}" target="${link.href.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${link.label}</a>`
        : `<span style="color:#C3C9D6;">${link.label}</span>`;
      return `<div class="contact-row"><span class="ico">${link.icon}</span>${inner}</div>`;
    })
    .join('');
  return `<div class="panel-body">${links}<p style="margin-top:22px;color:#8893A8;font-size:0.85rem;">${content.note}</p></div>`;
}

export function renderStationHeader(content: AnyStationContent): string {
  return `<div class="panel-eyebrow" style="--accent:${content.accentHex}">${content.eyebrow}</div>
    <div class="panel-title">${content.title}</div>`;
}
