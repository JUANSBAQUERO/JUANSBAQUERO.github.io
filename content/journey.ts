import type { JourneyBeat, JourneyScene } from '../src/domain/entities/Journey';
import {
  aboutContent,
  contactContent,
  experienceContent,
  projectsContent,
  skillsContent,
} from './portfolio';

/**
 * The four journey scenes, in visit order. xStart/xEnd are world-space X
 * units the character travels through while ITS OWN beats are scrolled
 * through (see JourneyProgress.computeCharacterPosition). Walking/Running
 * are baked "in place" (no root motion -- verified by inspecting the Hips
 * translation channel), so 100% of the character's on-screen horizontal
 * movement comes from this xStart/xEnd range, driven by scroll.
 *
 * "crash" and "bow" are intentionally stationary anchors (xStart === xEnd):
 * `dying_backwards` has real baked root motion (the hip bone itself falls
 * backward/down), so holding the GROUP still and letting the clip play is
 * what produces the "slams into something and goes down" effect. The bow
 * clip then has to visibly "pop" the character back upright to bow -- that
 * reads as "gets up, dusts off, bows," which fits the playful chibi tone.
 */
export const journeyScenes: readonly JourneyScene[] = [
  { key: 'walk', clipName: 'Walking', xStart: -6, xEnd: -2, loop: true, facingY: Math.PI / 2 },
  { key: 'run', clipName: 'Running', xStart: -2, xEnd: 6, loop: true, facingY: Math.PI / 2 },
  { key: 'crash', clipName: 'dying_backwards', xStart: 6, xEnd: 6, loop: false, facingY: Math.PI / 2 },
  { key: 'bow', clipName: 'Gentlemans_Bow', xStart: 6, xEnd: 6, loop: false, facingY: 0 },
];

export const journeyBeats: readonly JourneyBeat[] = [
  { id: 'hero', scene: 'walk', contentId: 'hero' },
  { id: 'about', scene: 'walk', contentId: 'about' },
  { id: 'experience', scene: 'run', contentId: 'experience' },
  { id: 'projects', scene: 'crash', contentId: 'projects' },
  { id: 'skills', scene: 'crash', contentId: 'skills' },
  { id: 'contact', scene: 'bow', contentId: 'contact' },
];

/** Re-exported so main.ts has one import for both the layout (above) and
 *  the actual copy/data to render into each beat's card. */
export { aboutContent, contactContent, experienceContent, projectsContent, skillsContent };
