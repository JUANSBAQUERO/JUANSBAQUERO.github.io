import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import { MovementController } from '../../../../src/infrastructure/three/input/MovementController';
import { PLAY_RADIUS } from '../../../../src/infrastructure/three/scene/Environment';
import type { PedestalUserData } from '../../../../src/infrastructure/three/scene/Pedestal';
import type { KeyState } from '../../../../src/infrastructure/three/input/KeyboardInput';

/**
 * Minimal fake of PointerLockControls — just enough surface area
 * (isLocked, getObject, moveRight, moveForward) for MovementController to
 * drive. moveRight/moveForward are no-ops here on purpose: these tests
 * target the boundary clamp / collision / head-bob math, which runs on
 * `rig.position` regardless of how it got there.
 */
function createFakeControls(startPosition: THREE.Vector3, isLocked = true) {
  const rig = new THREE.Object3D();
  rig.position.copy(startPosition);
  return {
    isLocked,
    getObject: () => rig,
    moveRight: vi.fn(),
    moveForward: vi.fn(),
  } as unknown as import('three/addons/controls/PointerLockControls.js').PointerLockControls;
}

function createPedestal(x: number, z: number, collisionRadius = 1.9): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData = { collisionRadius } satisfies Partial<PedestalUserData>;
  return group;
}

const noKeys: KeyState = { w: false, a: false, s: false, d: false };

describe('MovementController', () => {
  it('does nothing when pointer lock is not active', () => {
    const controls = createFakeControls(new THREE.Vector3(100, 1.7, 100), false);
    const movement = new MovementController(controls, [], new THREE.Clock());

    movement.update(0.016, noKeys, false);

    expect(controls.getObject().position.x).toBe(100);
    expect(controls.getObject().position.z).toBe(100);
  });

  it('does nothing while a panel is open, even if locked', () => {
    const controls = createFakeControls(new THREE.Vector3(5, 1.7, 5), true);
    const movement = new MovementController(controls, [], new THREE.Clock());

    movement.update(0.016, noKeys, true);

    expect(controls.getObject().position.x).toBe(5);
    expect(controls.getObject().position.z).toBe(5);
  });

  it('clamps the player to PLAY_RADIUS when they drift outside the plaza boundary', () => {
    const outside = new THREE.Vector3(PLAY_RADIUS + 10, 1.7, 0);
    const controls = createFakeControls(outside, true);
    const movement = new MovementController(controls, [], new THREE.Clock());

    movement.update(0.016, noKeys, false);

    const rig = controls.getObject();
    const distFromCenter = Math.sqrt(rig.position.x ** 2 + rig.position.z ** 2);
    expect(distFromCenter).toBeCloseTo(PLAY_RADIUS, 5);
  });

  it('leaves the player untouched when already inside the plaza boundary', () => {
    const inside = new THREE.Vector3(3, 1.7, 4); // dist = 5, well within PLAY_RADIUS
    const controls = createFakeControls(inside, true);
    const movement = new MovementController(controls, [], new THREE.Clock());

    movement.update(0.016, noKeys, false);

    const rig = controls.getObject();
    expect(rig.position.x).toBeCloseTo(3, 5);
    expect(rig.position.z).toBeCloseTo(4, 5);
  });

  it('pushes the player back out when overlapping a pedestal collision radius', () => {
    const pedestal = createPedestal(0, 0, 1.9);
    // Standing 1.0 units from the pedestal center — well inside its 1.9 collision radius.
    const controls = createFakeControls(new THREE.Vector3(1.0, 1.7, 0), true);
    const movement = new MovementController(controls, [pedestal], new THREE.Clock());

    movement.update(0.016, noKeys, false);

    const rig = controls.getObject();
    const distFromPedestal = Math.sqrt(rig.position.x ** 2 + rig.position.z ** 2);
    expect(distFromPedestal).toBeCloseTo(1.9, 5);
  });

  it('does not push the player when outside every pedestal collision radius', () => {
    const pedestal = createPedestal(10, 10, 1.9);
    const controls = createFakeControls(new THREE.Vector3(0, 1.7, 0), true);
    const movement = new MovementController(controls, [pedestal], new THREE.Clock());

    movement.update(0.016, noKeys, false);

    const rig = controls.getObject();
    expect(rig.position.x).toBeCloseTo(0, 5);
    expect(rig.position.z).toBeCloseTo(0, 5);
  });

  it('resets head height to the standing eye level (1.7) when idle', () => {
    const controls = createFakeControls(new THREE.Vector3(0, 9, 0), true);
    const movement = new MovementController(controls, [], new THREE.Clock());

    movement.update(0.016, noKeys, false);

    expect(controls.getObject().position.y).toBe(1.7);
  });

  it('bobs the head away from the resting height while a movement key is held', () => {
    const controls = createFakeControls(new THREE.Vector3(0, 1.7, 0), true);
    const movement = new MovementController(controls, [], new THREE.Clock());

    movement.update(0.1, { w: true, a: false, s: false, d: false }, false);

    // elapsedTime at the moment of the first getDelta()-less update is tiny but
    // nonzero clock time has passed since construction, so the sinusoid is not
    // guaranteed to be nonzero at t=0 — assert it stays within the documented
    // +/-0.035 bob amplitude around 1.7 rather than asserting an exact value.
    const y = controls.getObject().position.y;
    expect(y).toBeGreaterThanOrEqual(1.7 - 0.035 - 1e-6);
    expect(y).toBeLessThanOrEqual(1.7 + 0.035 + 1e-6);
  });
});
