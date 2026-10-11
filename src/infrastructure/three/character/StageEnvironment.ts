import * as THREE from 'three';

export interface StageEnvironment {
  readonly platformRing: THREE.Mesh;
}

/**
 * Builds the fixed pedestal/platform the character stands on, plus lighting.
 * There is no walkable floor or boundary here — the camera never moves on
 * the ground plane in the scroll-narrative layout, so this is purely a
 * visual base for the character (podium + soft rim light), not a play space.
 */
export function buildStageEnvironment(scene: THREE.Scene): StageEnvironment {
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(2, 5, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffe8d6, 0.35);
  fillLight.position.set(-3, 2, 3);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x4cf3ff, 0.8, 12, 2);
  rimLight.position.set(-2, 2.4, -3);
  scene.add(rimLight);

  const platformRing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.7, 0.18, 48),
    new THREE.MeshStandardMaterial({ color: 0x0e1a24, roughness: 0.4, metalness: 0.5 }),
  );
  platformRing.position.y = -0.09;
  scene.add(platformRing);

  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.58, 0.02, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x4cf3ff }),
  );
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = 0.005;
  scene.add(glowRing);

  return { platformRing };
}
