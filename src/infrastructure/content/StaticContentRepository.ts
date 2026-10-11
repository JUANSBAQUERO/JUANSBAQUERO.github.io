import type { ContentRepository } from '../../domain/repositories/ContentRepository';
import type { AnyStationContent, StationKey, StationSection } from '../../domain/entities/Station';
import {
  aboutContent,
  contactContent,
  experienceContent,
  projectsContent,
  skillsContent,
  stationLayout,
} from '../../../content/portfolio';

/**
 * Concrete adapter: reads content from the static TS module in /content.
 * Implements the ContentRepository port — swap this single class (e.g. for
 * a fetch-based adapter hitting a CMS) and nothing upstream changes.
 */
export class StaticContentRepository implements ContentRepository {
  private readonly byKey: Record<StationKey, AnyStationContent> = {
    about: aboutContent,
    experience: experienceContent,
    projects: projectsContent,
    skills: skillsContent,
    contact: contactContent,
  };

  getStationLayout(): readonly StationSection[] {
    return stationLayout;
  }

  getStationContent(key: StationKey): AnyStationContent {
    return this.byKey[key];
  }

  getAllContent(): Readonly<Record<StationKey, AnyStationContent>> {
    return this.byKey;
  }
}
