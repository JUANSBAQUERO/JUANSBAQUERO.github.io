import { describe, expect, it } from 'vitest';
import { poseForStation } from '../../../src/application/services/CharacterPoseService';

describe('poseForStation', () => {
  it('returns the idle pose (no scanning, no bob boost) for null (no active section)', () => {
    const pose = poseForStation(null);
    expect(pose.scanning).toBe(false);
    expect(pose.bobIntensity).toBe(1);
    expect(pose.leftArmX).toBe(0);
    expect(pose.rightArmX).toBe(0);
  });

  it('enables the hologram scan effect ONLY for the about station', () => {
    expect(poseForStation('about').scanning).toBe(true);
    for (const key of ['experience', 'projects', 'skills', 'contact'] as const) {
      expect(poseForStation(key).scanning).toBe(false);
    }
  });

  it('raises the right arm for experience', () => {
    const pose = poseForStation('experience');
    expect(pose.rightArmX).toBeLessThan(0);
  });

  it('raises both arms more for skills than for projects (bigger "flex" pose)', () => {
    const projects = poseForStation('projects');
    const skills = poseForStation('skills');
    expect(Math.abs(skills.leftArmX)).toBeGreaterThan(Math.abs(projects.leftArmX));
    expect(Math.abs(skills.rightArmX)).toBeGreaterThan(Math.abs(projects.rightArmX));
  });

  it('crosses the arms (opposite Z signs) for the contact pose', () => {
    const pose = poseForStation('contact');
    expect(pose.leftArmZ).toBeGreaterThan(0);
    expect(pose.rightArmZ).toBeLessThan(0);
  });

  it('boosts bob intensity for projects (more energetic idle)', () => {
    const projects = poseForStation('projects');
    const about = poseForStation('about');
    expect(projects.bobIntensity).toBeGreaterThan(about.bobIntensity);
  });
});
