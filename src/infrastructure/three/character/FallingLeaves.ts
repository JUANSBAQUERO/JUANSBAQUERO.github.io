import * as THREE from 'three';

/**
 * A simple falling-leaves particle system: flat leaf-shaped sprites drawn
 * once onto a small canvas texture (an ellipse with a center vein -- a
 * generic leaf silhouette, not based on any specific tree species or
 * franchise artwork), instanced across a large billboard-style point cloud
 * that drifts down and sideways in a loop. Pure procedural geometry/canvas,
 * no external assets.
 */
const LEAF_COUNT = 70;
const AREA_WIDTH = 26; // world units along X the leaves spawn/wrap across
const AREA_HEIGHT = 9; // world units of vertical fall range
const AREA_DEPTH = 6; // world units of Z spread (in front of/behind the walkway)

export class FallingLeaves {
  readonly points: THREE.Points;
  private readonly velocities: Float32Array;
  private readonly spinSpeeds: Float32Array;
  private readonly geometry: THREE.BufferGeometry;
  private readonly basePositions: Float32Array;

  constructor() {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(LEAF_COUNT * 3);
    this.velocities = new Float32Array(LEAF_COUNT * 2); // [vx, vy] per leaf
    this.spinSpeeds = new Float32Array(LEAF_COUNT);

    const rng = mulberry32(55);
    for (let i = 0; i < LEAF_COUNT; i++) {
      positions[i * 3] = (rng() - 0.5) * AREA_WIDTH;
      positions[i * 3 + 1] = rng() * AREA_HEIGHT;
      positions[i * 3 + 2] = -1 + (rng() - 0.5) * AREA_DEPTH;

      this.velocities[i * 2] = (rng() - 0.5) * 0.25; // gentle horizontal drift
      this.velocities[i * 2 + 1] = 0.25 + rng() * 0.35; // fall speed
      this.spinSpeeds[i] = (rng() - 0.5) * 2;
    }

    this.basePositions = positions.slice();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.22,
      map: createLeafTexture(),
      transparent: true,
      depthWrite: false,
      color: 0xd98a3d,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, material);
  }

  update(delta: number): void {
    const positions = this.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < LEAF_COUNT; i++) {
      const sway = Math.sin(performance.now() * 0.0006 + i) * 0.15;
      positions[i * 3] += (this.velocities[i * 2] + sway * delta) * delta * 4;
      positions[i * 3 + 1] -= this.velocities[i * 2 + 1] * delta;

      // Wrap around once a leaf falls below the walkway or drifts past the
      // horizontal spawn area, so the loop never visibly "resets" all at
      // once -- each leaf recycles independently at a random top position.
      if (positions[i * 3 + 1] < -0.5) {
        positions[i * 3 + 1] = AREA_HEIGHT;
        positions[i * 3] = this.basePositions[i * 3] + (Math.random() - 0.5) * 2;
      }
      if (positions[i * 3] > AREA_WIDTH / 2) positions[i * 3] = -AREA_WIDTH / 2;
      if (positions[i * 3] < -AREA_WIDTH / 2) positions[i * 3] = AREA_WIDTH / 2;
    }
    this.geometry.attributes.position.needsUpdate = true;
  }

  dispose(): void {
    this.geometry.dispose();
    (this.points.material as THREE.PointsMaterial).map?.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}

/** Draws a simple generic leaf silhouette (ellipse body + center vein) onto
 *  a small canvas, used as the point sprite texture. */
function createLeafTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.translate(size / 2, size / 2);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.22, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.38);
    ctx.lineTo(0, size * 0.38);
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
