import * as THREE from 'three';

/**
 * Procedurally draws a wooden plank walkway texture (warm brown boards with
 * visible seams and subtle grain streaks) -- a generic dojo/village-path
 * look for the character's walkway, replacing the keyboard motif. Pure 2D
 * canvas drawing, no external assets, no franchise-specific symbols.
 */
const CANVAS_SIZE = 1024;
const PLANK_WIDTH = 96;

export function createWoodPlankFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const rng = mulberry32(42);
  const plankCount = Math.ceil(CANVAS_SIZE / PLANK_WIDTH);

  for (let i = 0; i < plankCount; i++) {
    const x = i * PLANK_WIDTH;
    const shade = 36 + Math.floor(rng() * 14);
    ctx.fillStyle = `rgb(${shade + 50}, ${shade + 28}, ${shade + 14})`;
    ctx.fillRect(x, 0, PLANK_WIDTH, CANVAS_SIZE);

    // Seam between planks.
    ctx.fillStyle = 'rgba(20, 12, 8, 0.6)';
    ctx.fillRect(x, 0, 3, CANVAS_SIZE);

    // A few horizontal grain streaks per plank.
    ctx.strokeStyle = 'rgba(20, 12, 8, 0.15)';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 5; g++) {
      const y = rng() * CANVAS_SIZE;
      ctx.beginPath();
      ctx.moveTo(x + 4, y);
      ctx.lineTo(x + PLANK_WIDTH - 4, y + (rng() - 0.5) * 20);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
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
