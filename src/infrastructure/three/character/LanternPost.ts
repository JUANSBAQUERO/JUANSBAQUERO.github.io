import * as THREE from 'three';

/**
 * Builds a simple bamboo post topped with a warm paper lantern -- generic
 * primitives (cylinders + a glowing sphere), not based on any specific
 * franchise's set design. Used to replace the old flat cyan marker bars
 * along the walkway with something that reads as "village path at night"
 * instead of an abstract tech-UI element.
 */
export function createLanternPost(): THREE.Group {
  const group = new THREE.Group();

  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2d1a, roughness: 0.85 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.6, 8), poleMaterial);
  pole.position.y = 0.8;
  group.add(pole);

  const armMaterial = poleMaterial;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 6), armMaterial);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(0.17, 1.55, 0);
  group.add(arm);

  const lanternMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb060,
    emissive: 0xff8a3d,
    emissiveIntensity: 1.1,
    transparent: true,
    opacity: 0.92,
  });
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), lanternMaterial);
  lantern.position.set(0.34, 1.38, 0);
  group.add(lantern);

  const light = new THREE.PointLight(0xff9a4d, 0.6, 3, 2);
  light.position.copy(lantern.position);
  group.add(light);

  return group;
}
