import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { ProximityTracker } from '../../../../src/infrastructure/three/input/ProximityTracker';
import type { PedestalUserData } from '../../../../src/infrastructure/three/scene/Pedestal';
import type { StationKey } from '../../../../src/domain/entities/Station';

function createFakeControls(position: THREE.Vector3) {
  const rig = new THREE.Object3D();
  rig.position.copy(position);
  return {
    getObject: () => rig,
  } as unknown as import('three/addons/controls/PointerLockControls.js').PointerLockControls;
}

function createPedestal(key: StationKey, x: number, z: number, interactRadius = 4.4): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData = { key, interactRadius } satisfies Partial<PedestalUserData>;
  return group;
}

describe('ProximityTracker', () => {
  it('reports no nearby station when every pedestal is out of interaction range', () => {
    const controls = createFakeControls(new THREE.Vector3(0, 1.7, 0));
    const pedestals = [createPedestal('about', 100, 100)];
    const tracker = new ProximityTracker(controls, pedestals);

    const nearest = tracker.update(false);

    expect(nearest).toBeNull();
    expect(tracker.currentKey).toBeNull();
  });

  it('reports the station key when standing within its interaction radius', () => {
    const controls = createFakeControls(new THREE.Vector3(0, 1.7, -10));
    const pedestals = [createPedestal('about', 0, -11, 4.4)]; // dist = 1, well within radius
    const tracker = new ProximityTracker(controls, pedestals);

    const nearest = tracker.update(false);

    expect(nearest).not.toBeNull();
    expect(tracker.currentKey).toBe('about');
  });

  it('picks the NEAREST pedestal when two interaction radii overlap', () => {
    const controls = createFakeControls(new THREE.Vector3(0, 1.7, 0));
    const far = createPedestal('skills', 4, 0, 10); // dist = 4
    const near = createPedestal('contact', 1, 0, 10); // dist = 1
    const tracker = new ProximityTracker(controls, [far, near]);

    tracker.update(false);

    expect(tracker.currentKey).toBe('contact');
  });

  it('always reports null while a panel is open, regardless of distance', () => {
    const controls = createFakeControls(new THREE.Vector3(0, 1.7, 0));
    const pedestals = [createPedestal('projects', 0.1, 0, 10)];
    const tracker = new ProximityTracker(controls, pedestals);

    const nearest = tracker.update(true);

    expect(nearest).toBeNull();
    expect(tracker.currentKey).toBeNull();
  });
});
