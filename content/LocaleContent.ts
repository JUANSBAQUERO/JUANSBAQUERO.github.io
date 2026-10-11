import type { AboutContent, ContactContent, ExperienceContent, ProjectsContent, SkillsContent } from '../src/domain/entities/Station';
import type { Locale } from '../src/domain/entities/Locale';

/** UI chrome strings that aren't tied to a specific Station (nav labels,
 *  hero copy, CTA button, section tag pills, headings). */
export interface UiStrings {
  readonly nav: {
    readonly about: string;
    readonly experience: string;
    readonly projects: string;
    readonly skills: string;
    readonly contact: string;
  };
  readonly cta: string;
  readonly hero: {
    readonly eyebrow: string;
    readonly greetingPrefix: string; // "Hi, I'm " / "Hola, soy "
    readonly name: string;
    readonly subtitle: string;
    readonly body: string;
    readonly scrollHint: string;
  };
  readonly aboutTag: string;
  readonly experienceTag: string;
  readonly experienceHeading: string;
  readonly projectsTag: string;
  readonly projectsHeading: string;
  readonly skillsTag: string;
  readonly skillsHeading: string;
  readonly contactHeading: string;
  readonly aboutRole: string;
  readonly footerLegalLink: string;
}

/** Content for the Privacy & Legal Notice popup (see LegalModal.ts). Plain
 *  informational copy about a personal portfolio site -- not a substitute
 *  for professional legal advice, but covers what a visitor would
 *  reasonably expect to find (what's collected, cookies/localStorage use,
 *  third-party embeds, contact, content ownership). */
export interface LegalContent {
  readonly title: string;
  readonly lastUpdated: string;
  readonly sections: readonly {
    readonly heading: string;
    readonly paragraphs: readonly string[];
  }[];
  readonly closeLabel: string;
}

export interface LocaleContent {
  readonly ui: UiStrings;
  readonly about: AboutContent;
  readonly experience: ExperienceContent;
  readonly projects: ProjectsContent;
  readonly skills: SkillsContent;
  readonly contact: ContactContent;
  readonly legal: LegalContent;
}

/** Content repository keyed by locale -- loaded lazily per-locale so
 *  switching language never needs a full page reload, just a re-render of
 *  the DOM text nodes (see LocaleSwitcher in main.ts). */
export type LocaleContentMap = Readonly<Record<Locale, LocaleContent>>;
