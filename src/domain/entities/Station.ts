/**
 * Domain entity: a "Station" is a point of interest in the 3D space the
 * visitor can walk up to and interact with (e.g. About, Experience, Projects).
 *
 * This file has ZERO knowledge of Three.js, the DOM, or rendering — it is
 * pure data + types, so the content and the 3D engine can evolve independently
 * (Dependency Inversion: infrastructure depends on this, not the other way).
 */

export type StationKey =
  "about" | "experience" | "projects" | "skills" | "contact";

export interface Vec3Tuple {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface StationSection {
  readonly key: StationKey;
  /** Hex color used for neon accents tied to this station (e.g. 0x4cf3ff). */
  readonly color: number;
  readonly position: Vec3Tuple;
}

export interface JobEntry {
  readonly role: string;
  readonly org: string;
  readonly period: string;
  readonly summary: string;
  readonly tags: readonly string[];
}

export interface ProjectEntry {
  readonly org: string;
  readonly title: string;
  readonly summary: string;
}

export interface SkillGroup {
  readonly title: string;
  readonly skills: readonly string[];
}

export interface ContactLink {
  readonly icon: string;
  readonly label: string;
  readonly href?: string;
}

export interface StationContent {
  readonly key: StationKey;
  readonly accentHex: string;
  readonly eyebrow: string;
  readonly title: string;
}

export interface AboutContent extends StationContent {
  readonly key: "about";
  readonly paragraphs: readonly string[];
}

export interface ExperienceContent extends StationContent {
  readonly key: "experience";
  readonly jobs: readonly JobEntry[];
}

export interface ProjectsContent extends StationContent {
  readonly key: "projects";
  readonly projects: readonly ProjectEntry[];
}

export interface SkillsContent extends StationContent {
  readonly key: "skills";
  readonly groups: readonly SkillGroup[];
}

export interface ContactContent extends StationContent {
  readonly key: "contact";
  readonly links: readonly ContactLink[];
  readonly note: string;
}

export type AnyStationContent =
  | AboutContent
  | ExperienceContent
  | ProjectsContent
  | SkillsContent
  | ContactContent;
