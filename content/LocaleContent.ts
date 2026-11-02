import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  LabContent,
  ProjectsContent,
  SkillsContent,
} from '../src/domain/entities/Station';
import type { Locale } from '../src/domain/entities/Locale';

/** UI chrome strings that aren't tied to a specific Station (nav labels,
 *  hero copy, CTA button, section tag pills, headings). */
export interface UiStrings {
  readonly nav: {
    readonly about: string;
    readonly experience: string;
    readonly projects: string;
    readonly lab: string;
    readonly skills: string;
    readonly contact: string;
  };
  readonly cta: string;
  readonly hero: {
    readonly eyebrow: string;
    readonly availability: string; // small badge: "Open to full-time roles & freelance"
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
  readonly labTag: string;
  readonly labHeading: string;
  readonly skillsTag: string;
  readonly skillsHeading: string;
  readonly contactHeading: string;
  readonly aboutRole: string;
  readonly footerLegalLink: string;
  /** Loading-spinner caption shown while the 3D character GLB fetches --
   *  a brand voice touch instead of a generic "Loading...". */
  readonly stageLoadingCaption: string;
  /** Click-hint tooltip shown near the character stage the first time a
   *  visitor hovers it, teasing the click easter egg (see JourneyScene's
   *  click handler + CHARACTER_REACTIONS in content/journey.ts). */
  readonly characterClickHint: string;
  /** Short one-liners the character "says" (speech bubble) when clicked --
   *  one picked at random per click, never twice in a row. Brand-voice
   *  easter egg, not functional copy -- keep these short and punchy. */
  readonly characterReactions: readonly string[];
  /** Floating WhatsApp button: accessible label + prefilled chat message
   *  (URL-encoded at render time, not here). */
  readonly whatsappLabel: string;
  readonly whatsappMessage: string;
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
  readonly lab: LabContent;
  readonly skills: SkillsContent;
  readonly contact: ContactContent;
  readonly legal: LegalContent;
}

/** Content repository keyed by locale -- loaded lazily per-locale so
 *  switching language never needs a full page reload, just a re-render of
 *  the DOM text nodes (see LocaleSwitcher in main.ts). */
export type LocaleContentMap = Readonly<Record<Locale, LocaleContent>>;
