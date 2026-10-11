import * as THREE from 'three';

/**
 * Procedurally paints a warm anime-style sunset sky onto a canvas: a
 * vertical gradient (deep orange horizon fading up into dusky purple),
 * a soft sun disc, and layered mountain silhouettes for depth. Pure 2D
 * canvas drawing -- no external image assets, and nothing here reproduces
 * any specific franchise's trademarked symbols, characters, or palette;
 * it's a generic "shinobi village at dusk" mood, assembled from primitive
 * shapes/gradients only.
 */
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

export function createAnimeSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  drawSkyGradient(ctx);
  drawSun(ctx);
  drawMountainLayer(ctx, 0.62, 'rgba(40, 22, 28, 0.9)', 11);
  drawMountainLayer(ctx, 0.74, 'rgba(26, 14, 20, 0.95)', 7);
  drawClouds(ctx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawSkyGradient(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, '#3a2347');
  gradient.addColorStop(0.35, '#7a3a4a');
  gradient.addColorStop(0.62, '#e2703a');
  gradient.addColorStop(0.78, '#f4a24c');
  gradient.addColorStop(1, '#f7c56c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawSun(ctx: CanvasRenderingContext2D): void {
  const cx = CANVAS_WIDTH * 0.68;
  const cy = CANVAS_HEIGHT * 0.56;
  const radius = 150;

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.2);
  glow.addColorStop(0, 'rgba(255, 221, 170, 0.55)');
  glow.addColorStop(1, 'rgba(255, 221, 170, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = 'rgba(255, 237, 210, 0.9)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** A jagged mountain silhouette ridge line, filled solid, at a given
 *  height fraction of the canvas -- two layers at different heights/
 *  opacities give cheap parallax depth. */
function drawMountainLayer(
  ctx: CanvasRenderingContext2D,
  baseFraction: number,
  color: string,
  peakCount: number,
): void {
  const baseY = CANVAS_HEIGHT * baseFraction;
  const rng = mulberry32(Math.round(baseFraction * 1000));

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT);
  ctx.lineTo(0, baseY);
  const step = CANVAS_WIDTH / peakCount;
  for (let i = 0; i <= peakCount; i++) {
    const x = i * step;
    const y = baseY - rng() * CANVAS_HEIGHT * 0.16;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawClouds(ctx: CanvasRenderingContext2D): void {
  const rng = mulberry32(99);
  ctx.fillStyle = 'rgba(255, 220, 190, 0.18)';
  for (let i = 0; i < 6; i++) {
    const y = CANVAS_HEIGHT * (0.15 + rng() * 0.3);
    const width = 220 + rng() * 260;
    const x = rng() * CANVAS_WIDTH;
    ctx.beginPath();
    ctx.ellipse(x, y, width, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
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
