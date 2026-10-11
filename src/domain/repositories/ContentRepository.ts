import type {
  AnyStationContent,
  StationKey,
  StationSection,
} from "../entities/Station";

/**
 * Port (interface) for reading portfolio content. The domain/application
 * layers depend ONLY on this abstraction — never on a concrete JSON file or
 * fetch call. This is what makes it trivial to later swap the content source
 * (e.g. static TS object today, a headless CMS tomorrow) without touching a
 * single line of the 3D engine or UI code (Dependency Inversion Principle).
 */
export interface ContentRepository {
  getStationLayout(): readonly StationSection[];
  getStationContent(key: StationKey): AnyStationContent;
  getAllContent(): Readonly<Record<StationKey, AnyStationContent>>;
}
