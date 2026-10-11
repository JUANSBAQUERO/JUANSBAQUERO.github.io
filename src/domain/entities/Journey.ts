/**
 * Domain entity for the new "journey" narrative: the character physically
 * walks/runs/crashes/bows across the screen (left -> right) as the visitor
 * scrolls, instead of staying in a fixed center panel while content
 * sections scroll past it (the old Station model). Each JourneyBeat is one
 * full-viewport-height chunk of scroll with its OWN content card, so text
 * never has to share horizontal space with the character -- the content
 * area always gets the full width.
 *
 * Several beats can belong to the same JourneyScene (e.g. four Experience
 * jobs all play during the "run" scene) -- the scene determines which
 * animation clip and which stretch of the character's X travel is active;
 * the beat determines which content card is shown.
 */

export type JourneySceneKey = 'walk' | 'run' | 'crash' | 'bow';

export interface JourneyScene {
  readonly key: JourneySceneKey;
  /** Name of the animation clip in the single multi-clip GLB (see
   *  MultiClipCharacter) to play while this scene is active. */
  readonly clipName: string;
  /** Character X position (world units) at the START of this scene. */
  readonly xStart: number;
  /** Character X position (world units) at the END of this scene. */
  readonly xEnd: number;
  /** Whether the clip should loop continuously (walk/run) or play once and
   *  hold its last frame (crash impact, bow). */
  readonly loop: boolean;
  /** Y-axis facing angle (radians) the character should turn toward while
   *  this scene is active -- e.g. facing screen-right (Math.PI / 2) while
   *  walking/running, then turning to face the camera/viewer (0) for the
   *  final bow so it reads as greeting the visitor head-on. */
  readonly facingY: number;
}

export interface JourneyBeat {
  readonly id: string;
  readonly scene: JourneySceneKey;
  /** DOM id of the content card template to show while this beat is active
   *  (see content/journey.ts -> rendered into #journeyCard). */
  readonly contentId: string;
}
