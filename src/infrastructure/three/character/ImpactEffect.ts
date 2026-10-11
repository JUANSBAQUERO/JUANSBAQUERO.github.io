import * as THREE from 'three';

/**
 * A small "impact" effect triggered once when the character's crash scene
 * begins: a translucent glass-like pane that's invisible until the moment
 * of impact, when a crack pattern and a quick radial flash appear, plus a
 * handful of generic angular shard particles burst outward and fall/fade.
 * Everything here is procedural primitive geometry + a canvas-drawn crack
 * texture -- no external assets, no specific franchise iconography, just a
 * generic "ran into glass" read.
 */
const SHARD_COUNT = 16;
const CRACK_FADE_IN = 0.08;
const CRACK_HOLD = 2.2;
const CRACK_FADE_OUT = 1.4;
const FLASH_DURATION = 0.28;

export class ImpactEffect {
  readonly group = new THREE.Group();
  private readonly wall: THREE.Mesh;
  private readonly flash: THREE.Mesh;
  private readonly shards: THREE.Mesh[] = [];
  private readonly shardVelocities: THREE.Vector3[] = [];
  private readonly shardSpin: number[] = [];
  private elapsed = -1; // -1 = not triggered yet / fully settled
  private active = false;

  constructor() {
    const crackTexture = createCrackTexture();
    const wallMaterial = new THREE.MeshBasicMaterial({
      map: crackTexture,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.wall = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3), wallMaterial);
    this.group.add(this.wall);

    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.flash = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), flashMaterial);
    this.flash.position.z = 0.05;
    this.group.add(this.flash);

    const shardMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfeffa,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < SHARD_COUNT; i++) {
      const shard = new THREE.Mesh(createShardGeometry(), shardMaterial.clone());
      shard.visible = false;
      this.shards.push(shard);
      this.shardVelocities.push(new THREE.Vector3());
      this.shardSpin.push(0);
      this.group.add(shard);
    }
  }

  /** Plays the impact once at the given world position (the character's
   *  position when the crash scene starts) -- facing the same direction
   *  the character travels (+X), so the pane reads as something it just
   *  ran face-first into. */
  trigger(position: THREE.Vector3): void {
    this.group.position.copy(position);
    this.group.position.y += 1;
    this.group.position.x += 0.55;
    this.group.rotation.y = -Math.PI / 2;

    this.elapsed = 0;
    this.active = true;
    (this.wall.material as THREE.MeshBasicMaterial).opacity = 0;
    (this.flash.material as THREE.MeshBasicMaterial).opacity = 0.95;
    this.flash.scale.setScalar(1);

    const rng = Math.random;
    for (let i = 0; i < this.shards.length; i++) {
      const shard = this.shards[i];
      shard.visible = true;
      shard.position.set((rng() - 0.5) * 0.3, (rng() - 0.5) * 0.3, 0.05);
      shard.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
      (shard.material as THREE.MeshStandardMaterial).opacity = 0.85;

      const speed = 1.2 + rng() * 1.8;
      const angle = rng() * Math.PI * 2;
      this.shardVelocities[i].set(
        Math.cos(angle) * speed * 0.6, // mostly spreads in the wall's local XY plane
        Math.sin(angle) * speed * 0.6 + 1.0,
        (rng() - 0.5) * speed * 0.4,
      );
      this.shardSpin[i] = (rng() - 0.5) * 10;
    }
  }

  update(delta: number): void {
    if (!this.active) return;
    this.elapsed += delta;

    const wallMat = this.wall.material as THREE.MeshBasicMaterial;
    if (this.elapsed < CRACK_FADE_IN) {
      wallMat.opacity = (this.elapsed / CRACK_FADE_IN) * 0.5;
    } else if (this.elapsed < CRACK_FADE_IN + CRACK_HOLD) {
      wallMat.opacity = 0.5;
    } else {
      const t = (this.elapsed - CRACK_FADE_IN - CRACK_HOLD) / CRACK_FADE_OUT;
      wallMat.opacity = Math.max(0, 0.5 * (1 - t)) * 0.3; // settle to a faint permanent crack
    }

    const flashMat = this.flash.material as THREE.MeshBasicMaterial;
    if (this.elapsed < FLASH_DURATION) {
      const t = this.elapsed / FLASH_DURATION;
      this.flash.scale.setScalar(1 + t * 14);
      flashMat.opacity = 0.95 * (1 - t);
    } else {
      flashMat.opacity = 0;
    }

    const gravity = 3.2;
    for (let i = 0; i < this.shards.length; i++) {
      const shard = this.shards[i];
      if (!shard.visible) continue;
      const vel = this.shardVelocities[i];
      vel.y -= gravity * delta;
      shard.position.addScaledVector(vel, delta);
      shard.rotation.x += this.shardSpin[i] * delta;
      shard.rotation.y += this.shardSpin[i] * 0.7 * delta;

      const mat = shard.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.max(0, mat.opacity - delta * 0.6);
      if (mat.opacity <= 0 || this.elapsed > 2.5) shard.visible = false;
    }

    if (this.elapsed > CRACK_FADE_IN + CRACK_HOLD + CRACK_FADE_OUT + 0.5) {
      this.active = false;
    }
  }

  dispose(): void {
    this.wall.geometry.dispose();
    (this.wall.material as THREE.Material).dispose();
    this.flash.geometry.dispose();
    (this.flash.material as THREE.Material).dispose();
    for (const shard of this.shards) {
      shard.geometry.dispose();
      (shard.material as THREE.Material).dispose();
    }
  }
}

/** A small irregular quad standing in for a glass shard -- generic angular
 *  shape, not based on any specific design. */
function createShardGeometry(): THREE.BufferGeometry {
  const size = 0.08 + Math.random() * 0.1;
  const geometry = new THREE.BufferGeometry();
  const a = [0, size, 0];
  const b = [size * 0.7, -size * 0.3, 0];
  const c = [-size * 0.6, -size * 0.5, 0];
  const vertices = new Float32Array([...a, ...b, ...c]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** Draws a radial crack pattern (lines radiating from an off-center point,
 *  with a few secondary branch cracks) onto a canvas -- a generic "cracked
 *  glass" look assembled from straight line segments. */
function createCrackTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size * 0.5;
  const cy = size * 0.45;
  const rng = mulberry32(11);

  ctx.strokeStyle = 'rgba(220, 240, 255, 0.85)';
  ctx.lineWidth = 2;

  const mainCrackCount = 9;
  for (let i = 0; i < mainCrackCount; i++) {
    const angle = (i / mainCrackCount) * Math.PI * 2 + rng() * 0.3;
    const length = size * (0.25 + rng() * 0.25);
    let x = cx;
    let y = cy;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segments = 3 + Math.floor(rng() * 2);
    for (let s = 0; s < segments; s++) {
      x += Math.cos(angle + (rng() - 0.5) * 0.5) * (length / segments);
      y += Math.sin(angle + (rng() - 0.5) * 0.5) * (length / segments);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // A couple of concentric fracture rings near the impact point.
  ctx.strokeStyle = 'rgba(220, 240, 255, 0.4)';
  for (let r = 30; r < 110; r += 35) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.9, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
