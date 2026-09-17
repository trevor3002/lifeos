import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcVal = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2;
  const safeRadius = isMaskable ? maxR * 0.72 : maxR * 0.88;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter 0

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Base background: Deep sleek midnight slate gradient
      const bgProgress = (y + x * 0.5) / (height * 1.5);
      let r = Math.round(15 + bgProgress * 15);
      let g = Math.round(23 + bgProgress * 18);
      let b = Math.round(42 + bgProgress * 30);
      let a = 255;

      // Rounded container outline if not maskable
      if (!isMaskable) {
        const cornerDist = Math.max(Math.abs(dx) - (cx - maxR * 0.28), 0);
        const cornerDistY = Math.max(Math.abs(dy) - (cy - maxR * 0.28), 0);
        const cDist = Math.sqrt(cornerDist * cornerDist + cornerDistY * cornerDistY);
        if (cDist > maxR * 0.28) {
          a = 0;
        }
      }

      if (a > 0) {
        // Outer glowing ring
        const ringR = safeRadius * 0.88;
        const ringThickness = maxR * 0.045;
        const dRing = Math.abs(dist - ringR);
        if (dRing < ringThickness) {
          const intensity = 1 - dRing / ringThickness;
          // Gradient from emerald (#10b981) to indigo/violet (#6366f1)
          const t = (Math.sin(angle * 2) + 1) / 2;
          r = Math.round(r * (1 - intensity) + (16 * (1 - t) + 99 * t) * intensity);
          g = Math.round(g * (1 - intensity) + (185 * (1 - t) + 102 * t) * intensity);
          b = Math.round(b * (1 - intensity) + (129 * (1 - t) + 241 * t) * intensity);
        }

        // Triad nodes for Life OS: Tasks (top right), Habits (bottom right), Journal (left)
        // 3 petaled geometric motif
        const r1 = safeRadius * 0.45;
        for (let i = 0; i < 3; i++) {
          const petalAngle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          const px = cx + Math.cos(petalAngle) * (safeRadius * 0.42);
          const py = cy + Math.sin(petalAngle) * (safeRadius * 0.42);
          const pdist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));

          if (pdist < safeRadius * 0.32) {
            const pInt = Math.max(0, 1 - pdist / (safeRadius * 0.32));
            if (i === 0) { // Top: Emerald (Tasks / Action)
              r = Math.round(r * (1 - pInt * 0.7) + 16 * pInt * 0.7);
              g = Math.round(g * (1 - pInt * 0.7) + 185 * pInt * 0.7);
              b = Math.round(b * (1 - pInt * 0.7) + 129 * pInt * 0.7);
            } else if (i === 1) { // Bottom Right: Cyan/Teal (Habits / Consistency)
              r = Math.round(r * (1 - pInt * 0.7) + 6 * pInt * 0.7);
              g = Math.round(g * (1 - pInt * 0.7) + 182 * pInt * 0.7);
              b = Math.round(b * (1 - pInt * 0.7) + 212 * pInt * 0.7);
            } else { // Bottom Left: Indigo (Journal / Reflection)
              r = Math.round(r * (1 - pInt * 0.7) + 99 * pInt * 0.7);
              g = Math.round(g * (1 - pInt * 0.7) + 102 * pInt * 0.7);
              b = Math.round(b * (1 - pInt * 0.7) + 241 * pInt * 0.7);
            }
          }
        }

        // Center golden nucleus / core
        if (dist < safeRadius * 0.18) {
          const cInt = 1 - dist / (safeRadius * 0.18);
          r = Math.round(r * (1 - cInt) + 250 * cInt);
          g = Math.round(g * (1 - cInt) + 204 * cInt);
          b = Math.round(b * (1 - cInt) + 21 * cInt);
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNGs
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(64, 64, false));

// Also write public/icon.svg
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="triad1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="triad2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="triad3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />
  <!-- Outer Orbit -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="#334155" stroke-width="4" stroke-dasharray="8 8" />
  <circle cx="256" cy="256" r="180" fill="none" stroke="url(#triad1)" stroke-width="6" stroke-linecap="round" stroke-dasharray="140 1000" />

  <!-- Triad Nodes -->
  <!-- Top Node: Tasks (Action) -->
  <g transform="translate(256, 150)" filter="url(#glow)">
    <circle r="46" fill="url(#triad1)" />
    <path d="M-14 -2 L-4 8 L16 -12" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Bottom Right Node: Habits (Loop/Cycle) -->
  <g transform="translate(348, 310)" filter="url(#glow)">
    <circle r="46" fill="url(#triad2)" />
    <path d="M-12 -6 A 15 15 0 1 1 12 6 M7 12 L13 6 L7 0" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Bottom Left Node: Journal (Reflection/Book) -->
  <g transform="translate(164, 310)" filter="url(#glow)">
    <circle r="46" fill="url(#triad3)" />
    <path d="M-14 -12 L0 -6 L14 -12 L14 10 L0 16 L-14 10 Z M0 -6 L0 16" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Center Core -->
  <circle cx="256" cy="256" r="22" fill="#fbbf24" filter="url(#glow)" />
  <circle cx="256" cy="256" r="10" fill="#ffffff" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
console.log('Successfully generated all PWA icons (PNG + SVG)!');
