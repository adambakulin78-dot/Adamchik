const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create PNG buffer without external dependencies
function createPNG(width, height, drawFn) {
  // RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = a;
    }
  }

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 4)] = 0; // Filter None
    rgba.copy(
      scanlines,
      y * (1 + width * 4) + 1,
      y * width * 4,
      (y + 1) * width * 4
    );
  }

  const compressed = zlib.deflateSync(scanlines);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);

    // CRC calculation
    let crc = 0xffffffff;
    const combined = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < combined.length; i++) {
      const byte = combined[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ (byte >> j)) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
      }
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function drawBlueLockLogo(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = w * 0.46;

  // Background: Deep dark slate / obsidian with subtle radial vignette
  let r = 7;
  let g = 9;
  let b = 15;
  let a = 255;

  // Outer border ring (Cyan glow)
  if (dist < maxR && dist > maxR - 4) {
    return [6, 182, 212, 255]; // Cyan 500
  }

  // Inner geometric diamond / ego soccer pentagon
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const diamondDist = absX + absY;
  const diamondSize = w * 0.32;

  if (diamondDist < diamondSize && diamondDist > diamondSize - 6) {
    return [6, 182, 212, 255]; // Cyan border
  }

  if (diamondDist < diamondSize) {
    // Inside diamond: gradient
    const t = 1 - (diamondDist / diamondSize);
    return [
      Math.floor(10 + t * 6),
      Math.floor(30 + t * 152),
      Math.floor(60 + t * 152),
      255
    ];
  }

  // Subtle background glow around center
  if (dist < maxR) {
    const t = (1 - dist / maxR) * 0.4;
    r = Math.floor(7 + t * 20);
    g = Math.floor(9 + t * 70);
    b = Math.floor(15 + t * 120);
  }

  return [r, g, b, a];
}

const publicDir = path.join(__dirname, '..', 'public');

// Generate 192x192
const png192 = createPNG(192, 192, drawBlueLockLogo);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
console.log('Created icon-192.png');

// Generate 512x512
const png512 = createPNG(512, 512, drawBlueLockLogo);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
console.log('Created icon-512.png');

// Generate apple-touch-icon
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png192);
console.log('Created apple-touch-icon.png');

// Generate icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07090e" />
      <stop offset="100%" stop-color="#0b1329" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)" />
  <circle cx="256" cy="256" r="210" fill="none" stroke="#0e2a47" stroke-width="4" stroke-dasharray="8 8" />

  <!-- Ego Diamond Center -->
  <polygon points="256,90 390,256 256,422 122,256" fill="#042f2e" stroke="url(#cyanGrad)" stroke-width="8" filter="url(#glow)" />
  <polygon points="256,130 350,256 256,382 162,256" fill="#083344" stroke="#22d3ee" stroke-width="4" />

  <!-- Inner Blue Lock Pupil / Crosshair -->
  <circle cx="256" cy="256" r="45" fill="#06b6d4" />
  <circle cx="256" cy="256" r="22" fill="#080e1a" />
  <line x1="256" y1="180" x2="256" y2="332" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" />
  <line x1="180" y1="256" x2="332" y2="256" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);
console.log('Created icon.svg');
