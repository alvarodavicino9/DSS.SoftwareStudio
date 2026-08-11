import * as THREE from 'three';

/** Fine grayscale noise — used as a roughness/bump map so flat-color
 *  materials read as fabric/brushed-metal instead of plastic-smooth CG. */
export function noiseTexture(size = 128, low = 150, high = 210, repeat = 3) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = low + Math.floor(Math.random() * (high - low));
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  return tex;
}

/** Horizontal two-color gradient strip — used for the figure's animated
 *  "screen is alive" scanline under the eyes. */
export function gradientStripTexture(colorA, colorB) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 128, 0);
  g.addColorStop(0, colorA);
  g.addColorStop(1, colorB);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 16);
  return new THREE.CanvasTexture(canvas);
}

/** Soft radial dot sprite — used for the background network's node points
 *  so they read as a glow instead of hard-edged circles. */
export function dotSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}
