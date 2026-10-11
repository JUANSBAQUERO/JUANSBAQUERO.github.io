import * as THREE from "three";

export const PLAY_RADIUS = 23;

/**
 * Builds the static environment (lights, floor, boundary ring, starfield,
 * central landmark) into a given scene. Separated from Pedestal/Camera/Input
 * so each concern can change independently (Single Responsibility).
 */
export function buildEnvironment(scene: THREE.Scene): { core: THREE.Mesh } {
  scene.background = new THREE.Color(0x05070a);
  scene.fog = new THREE.FogExp2(0x05070a, 0.018);

  scene.add(new THREE.AmbientLight(0x223344, 1.1));
  scene.add(new THREE.HemisphereLight(0x335577, 0x05070a, 0.6));

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0a0f18,
      roughness: 0.85,
      metalness: 0.1,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const grid = new THREE.GridHelper(200, 80, 0x1c3a4a, 0x12222e);
  grid.position.y = 0.01;
  scene.add(grid);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(PLAY_RADIUS - 0.15, PLAY_RADIUS, 96),
    new THREE.MeshBasicMaterial({
      color: 0x4cf3ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  scene.add(ring);

  scene.add(buildStarfield());

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0a2230,
      emissive: 0x1ac9e6,
      emissiveIntensity: 1.6,
      roughness: 0.3,
      metalness: 0.4,
      wireframe: true,
    }),
  );
  core.position.set(0, 3.2, -3);
  scene.add(core);

  return { core };
}

function buildStarfield(): THREE.Points {
  const starCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const r = 60 + Math.random() * 120;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.6 + 6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x6fe8ff,
    size: 0.6,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  return new THREE.Points(geometry, material);
}
