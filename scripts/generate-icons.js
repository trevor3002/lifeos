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

// Awwwards-worthy Obsidian + Burnished Bronze & Forest Sage palette (NO PURPLE)
function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdr);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2;
  const safeRadius = isMaskable ? maxR * 0.72 : maxR * 0.88;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep Obsidian background (#0b0c0e -> #14161a)
      const grad = (y + x * 0.5) / (height * 1.5);
      let r = Math.round(11 + grad * 9);
      let g = Math.round(12 + grad * 10);
      let b = Math.round(14 + grad * 12);
      let a = 255;

      if (!isMaskable) {
        const cornerDist = Math.max(Math.abs(dx) - (cx - maxR * 0.28), 0);
        const cornerDistY = Math.max(Math.abs(dy) - (cy - maxR * 0.28), 0);
        const cDist = Math.sqrt(cornerDist * cornerDist + cornerDistY * cornerDistY);
        if (cDist > maxR * 0.28) {
          a = 0;
        }
      }

      if (a > 0) {
        // Precision architectural circle
        const ringR = safeRadius * 0.86;
        const ringThick = maxR * 0.035;
        const dRing = Math.abs(dist - ringR);
        if (dRing < ringThick) {
          const intensity = 1 - dRing / ringThick;
          // Bronze / Amber accent (#d97706)
          r = Math.round(r * (1 - intensity) + 217 * intensity);
          g = Math.round(g * (1 - intensity) + 119 * intensity);
          b = Math.round(b * (1 - intensity) + 6 * intensity);
        }

        // Inner geometric core: 3 interconnected architectural nodes
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          const px = cx + Math.cos(angle) * (safeRadius * 0.44);
          const py = cy + Math.sin(angle) * (safeRadius * 0.44);
          const pdist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));

          if (pdist < safeRadius * 0.28) {
            const pInt = Math.max(0, 1 - pdist / (safeRadius * 0.28));
            if (i === 0) { // Top: Forest Sage (#10b981)
              r = Math.round(r * (1 - pInt * 0.7) + 16 * pInt * 0.7);
              g = Math.round(g * (1 - pInt * 0.7) + 185 * pInt * 0.7);
              b = Math.round(b * (1 - pInt * 0.7) + 129 * pInt * 0.7);
            } else if (i === 1) { // Right: Warm Bronze (#f59e0b)
              r = Math.round(r * (1 - pInt * 0.7) + 245 * pInt * 0.7);
              g = Math.round(g * (1 - pInt * 0.7) + 158 * pInt * 0.7);
              b = Math.round(b * (1 - pInt * 0.7) + 11 * pInt * 0.7);
            } else { // Left: Bone white / steel (#e4e4e7)
              r = Math.round(r * (1 - pInt * 0.7) + 228 * pInt * 0.7);
              g = Math.round(g * (1 - pInt * 0.7) + 228 * pInt * 0.7);
              b = Math.round(b * (1 - pInt * 0.7) + 231 * pInt * 0.7);
            }
          }
        }

        // Center hub
        if (dist < safeRadius * 0.14) {
          const cInt = 1 - dist / (safeRadius * 0.14);
          r = Math.round(r * (1 - cInt) + 245 * cInt);
          g = Math.round(g * (1 - cInt) + 245 * cInt);
          b = Math.round(b * (1 - cInt) + 245 * cInt);
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

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(64, 64, false));

// Minimalist vector SVG
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="128" fill="#0c0d10" />
  <circle cx="256" cy="256" r="180" fill="none" stroke="#22252a" stroke-width="2" />
  <circle cx="256" cy="256" r="180" fill="none" stroke="#d97706" stroke-width="4" stroke-dasharray="90 1000" stroke-linecap="round" />
  
  <g transform="translate(256, 150)">
    <circle r="44" fill="#14161a" stroke="#10b981" stroke-width="2" />
    <path d="M-12 -2 L-4 6 L14 -12" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <g transform="translate(348, 310)">
    <circle r="44" fill="#14161a" stroke="#d97706" stroke-width="2" />
    <path d="M-10 -4 A 12 12 0 1 1 10 4 M6 10 L11 4 L6 -2" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <g transform="translate(164, 310)">
    <circle r="44" fill="#14161a" stroke="#e4e4e7" stroke-width="2" />
    <path d="M-12 -10 L0 -4 L12 -10 L12 8 L0 14 L-12 8 Z M0 -4 L0 14" fill="none" stroke="#e4e4e7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <circle cx="256" cy="256" r="14" fill="#f59e0b" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
console.log('Successfully regenerated icons with Obsidian & Warm Bronze palette.');
