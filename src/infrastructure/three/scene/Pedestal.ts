import * as THREE from "three";
import type { StationSection } from "../../../domain/entities/Station";

/**
 * Builds the sprite label that floats above each pedestal. Pure Three.js
 * factory function — no scene/state knowledge, easy to unit-test or swap.
 */
export function createLabelSprite(
  text: string,
  hexColor: string,
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "700 56px Space Grotesk, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = hexColor;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#EAF6FF";
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(5.4, 1.35, 1);
  return sprite;
}

export interface PedestalUserData {
  key: StationSection["key"];
  collisionRadius: number;
  interactRadius: number;
  gem: THREE.Mesh;
  spinRing: THREE.Mesh;
}

/**
 * Builds one interactive pedestal (base + spinning ring + glowing gem +
 * point light + floating label) for a given station, per the Single
 * Responsibility Principle: this module only knows how to BUILD a pedestal,
 * not how to animate or collide with it (see PedestalAnimator / MovementController).
 */
export function createPedestal(
  station: StationSection,
  title: string,
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(
    station.position.x,
    station.position.y,
    station.position.z,
  );

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.3, 0.4, 24),
    new THREE.MeshStandardMaterial({
      color: 0x11161f,
      roughness: 0.5,
      metalness: 0.6,
    }),
  );
  base.position.y = 0.2;
  group.add(base);

  const spinRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.025, 8, 64),
    new THREE.MeshBasicMaterial({ color: station.color }),
  );
  spinRing.rotation.x = Math.PI / 2;
  spinRing.position.y = 0.42;
  group.add(spinRing);

  const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.75, 0),
    new THREE.MeshStandardMaterial({
      color: 0x05070a,
      emissive: station.color,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.3,
    }),
  );
  gem.position.y = 2.1;
  group.add(gem);

  const pointLight = new THREE.PointLight(station.color, 3.5, 10, 2);
  pointLight.position.y = 2.1;
  group.add(pointLight);

  const hexColor = "#" + station.color.toString(16).padStart(6, "0");
  const label = createLabelSprite(title.toUpperCase(), hexColor);
  label.position.y = 3.6;
  group.add(label);

  const userData: PedestalUserData = {
    key: station.key,
    collisionRadius: 1.9,
    interactRadius: 4.4,
    gem,
    spinRing,
  };
  group.userData = userData;

  return group;
}
