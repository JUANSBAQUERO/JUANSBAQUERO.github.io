import * as THREE from 'three';

export interface CharacterRig {
  readonly group: THREE.Group;
  readonly head: THREE.Object3D;
  readonly leftArm: THREE.Object3D;
  readonly rightArm: THREE.Object3D;
  readonly scanPlane: THREE.Mesh;
  readonly hologramMaterials: readonly THREE.MeshStandardMaterial[];
  readonly bodyMaterial: THREE.MeshStandardMaterial;
}

const SKIN = 0xf2c9a1;
const HAIR = 0x1a0f08;
const SHIRT = 0xff6c4c;
const PANTS = 0x2a3550;
const ACCENT = 0x4cf3ff;

function addGhostTwin(mesh: THREE.Mesh, hologramMaterials: THREE.MeshStandardMaterial[]): void {
  const material = new THREE.MeshStandardMaterial({
    color: 0x05121a,
    emissive: ACCENT,
    emissiveIntensity: 1.4,
    wireframe: true,
    transparent: true,
    opacity: 0,
    depthTest: true,
  });
  const ghost = new THREE.Mesh(mesh.geometry, material);
  ghost.scale.setScalar(1.035);
  mesh.add(ghost);
  hologramMaterials.push(material);
}

/**
 * Builds a simple low-poly humanoid out of primitive geometry (capsules +
 * spheres) — no external .glb model. Intentionally "cute mascot" proportions
 * (big head, short limbs) so the primitive shapes read as a character rather
 * than a mannequin. Exposes the head/arm Object3D handles so CharacterStage
 * can drive them per the poses from CharacterPoseService.
 *
 * Each real body part (torso, legs, arms, head) carries a slightly larger
 * "ghost" wireframe twin, hidden at opacity 0 by default — these fade in
 * together during the About section's "hologram scan" pose, so the
 * humanoid silhouette (arms/legs/head as separate limbs) stays readable
 * instead of being replaced by one big capsule overlay.
 */
export function createCharacter(): CharacterRig {
  const group = new THREE.Group();
  const hologramMaterials: THREE.MeshStandardMaterial[] = [];

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: SHIRT, roughness: 0.6, metalness: 0.1 });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: PANTS, roughness: 0.6, metalness: 0.1 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.5, metalness: 0 });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.7, metalness: 0 });

  // Torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.55, 4, 12), bodyMaterial);
  torso.position.y = 1.35;
  group.add(torso);
  addGhostTwin(torso, hologramMaterials);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.15, 0.55, 4, 10);
  const leftLeg = new THREE.Mesh(legGeo, pantsMaterial);
  leftLeg.position.set(-0.18, 0.5, 0);
  group.add(leftLeg);
  addGhostTwin(leftLeg, hologramMaterials);
  const rightLeg = new THREE.Mesh(legGeo, pantsMaterial);
  rightLeg.position.set(0.18, 0.5, 0);
  group.add(rightLeg);
  addGhostTwin(rightLeg, hologramMaterials);

  // Head (big, mascot-style) on a pivot so tilt rotates around the neck.
  const head = new THREE.Group();
  head.position.y = 2.1;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), skinMaterial);
  head.add(skull);
  addGhostTwin(skull, hologramMaterials);
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMaterial,
  );
  hair.position.y = 0.06;
  head.add(hair);
  group.add(head);

  // Simple eyes on the +Z face so the character clearly reads as facing the
  // camera (the head sphere itself is otherwise perfectly symmetric).
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.3 });
  const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  leftEye.position.set(-0.14, -0.02, 0.37);
  head.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  rightEye.position.set(0.14, -0.02, 0.37);
  head.add(rightEye);

  // Arms, pivoted at the shoulder so X/Z rotation reads as "raising" / "crossing".
  const armGeo = new THREE.CapsuleGeometry(0.1, 0.42, 4, 10);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.46, 1.62, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, bodyMaterial);
  leftArmMesh.position.y = -0.24;
  leftArm.add(leftArmMesh);
  addGhostTwin(leftArmMesh, hologramMaterials);
  group.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.46, 1.62, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, bodyMaterial);
  rightArmMesh.position.y = -0.24;
  rightArm.add(rightArmMesh);
  addGhostTwin(rightArmMesh, hologramMaterials);
  group.add(rightArm);

  // A thin glowing plane that sweeps vertically through the character while scanning.
  const scanPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.03),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0 }),
  );
  scanPlane.position.y = 1.3;
  group.add(scanPlane);

  return {
    group,
    head,
    leftArm,
    rightArm,
    scanPlane,
    hologramMaterials,
    bodyMaterial,
  };
}
