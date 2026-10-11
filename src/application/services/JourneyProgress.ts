import type { JourneyBeat, JourneyScene } from '../../domain/entities/Journey';

export interface BeatBounds {
  readonly id: string;
  readonly top: number;
  readonly height: number;
}

export interface ScenePosition {
  readonly sceneKey: JourneyScene['key'];
  readonly characterX: number;
}

/**
 * Pure math for the horizontal "journey" narrative: the character walks,
 * runs, crashes, then bows while the visitor scrolls vertically through a
 * stack of full-height content beats. No DOM access anywhere here -- the
 * caller measures scroll position / element offsets and passes plain
 * numbers in, so this is unit-testable without a browser (mirrors the old
 * ScrollSpy.ts pattern).
 */

/** Same trigger-line approach as the old computeActiveSectionKey: a beat
 *  becomes active once its top edge crosses a fixed fraction of the
 *  viewport from the top, avoiding flicker at section boundaries. */
export function computeActiveBeatId(
  beats: readonly BeatBounds[],
  scrollY: number,
  viewportHeight: number,
  triggerFraction = 0.4,
): string | null {
  if (beats.length === 0) return null;
  const triggerLine = scrollY + viewportHeight * triggerFraction;

  let active: BeatBounds | null = null;
  for (const beat of beats) {
    if (beat.top <= triggerLine && (!active || beat.top > active.top)) {
      active = beat;
    }
  }
  return active ? active.id : beats[0].id;
}

/** 0..1 progress across the whole scrollable document. */
export function computeGlobalProgress(scrollY: number, maxScroll: number): number {
  if (maxScroll <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / maxScroll));
}

/**
 * Scenes are visited once each, in array order, each owning a contiguous
 * run of beats. A scene's progress range is the fraction of the TOTAL beat
 * count its own beats span -- e.g. 2 of 6 beats gives that scene the
 * [0, 0.333] slice of the 0..1 global progress. Within its slice, the
 * character's X position is linearly interpolated from xStart to xEnd,
 * so scrolling through a scene's beats continuously walks/runs the
 * character across that stretch, independent of how many beats it has.
 */
export function computeCharacterPosition(
  scenes: readonly JourneyScene[],
  beats: readonly JourneyBeat[],
  globalProgress: number,
): ScenePosition {
  const totalBeats = beats.length;
  if (totalBeats === 0 || scenes.length === 0) {
    return { sceneKey: scenes[0]?.key ?? 'walk', characterX: scenes[0]?.xStart ?? 0 };
  }

  let cursor = 0;
  for (const scene of scenes) {
    const beatCount = beats.filter((b) => b.scene === scene.key).length;
    const sceneStart = cursor / totalBeats;
    cursor += beatCount;
    const sceneEnd = cursor / totalBeats;

    const isLastScene = scene === scenes[scenes.length - 1];
    if (globalProgress <= sceneEnd || isLastScene) {
      const span = sceneEnd - sceneStart;
      const t = span > 0 ? Math.min(1, Math.max(0, (globalProgress - sceneStart) / span)) : 1;
      const characterX = scene.xStart + (scene.xEnd - scene.xStart) * t;
      return { sceneKey: scene.key, characterX };
    }
  }

  const last = scenes[scenes.length - 1];
  return { sceneKey: last.key, characterX: last.xEnd };
}
