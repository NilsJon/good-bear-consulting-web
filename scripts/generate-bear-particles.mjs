import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const IMAGE_PATH = join(ROOT, "public", "bear-silhouette-sm.png");
const OUTPUT_PATH = join(ROOT, "public", "bear-particles.json");

// importance regions (same as component)
const IMPORTANCE_REGIONS = [
  { cx: 0.38, cy: 0.42, r: 0.025, w: 5.0 },
  { cx: 0.25, cy: 0.55, r: 0.03, w: 5.0 },
  { cx: 0.36, cy: 0.40, r: 0.05, w: 2.5 },
  { cx: 0.30, cy: 0.50, r: 0.04, w: 3.0 },
  { cx: 0.27, cy: 0.58, r: 0.03, w: 2.5 },
  { cx: 0.30, cy: 0.61, r: 0.05, w: 3.0 },
  { cx: 0.36, cy: 0.67, r: 0.04, w: 2.0 },
  { cx: 0.42, cy: 0.70, r: 0.06, w: 2.0 },
  { cx: 0.50, cy: 0.72, r: 0.06, w: 1.8 },
  { cx: 0.58, cy: 0.72, r: 0.06, w: 1.5 },
  { cx: 0.55, cy: 0.76, r: 0.07, w: 1.2 },
  { cx: 0.38, cy: 0.18, r: 0.05, w: 2.0 },
  { cx: 0.45, cy: 0.12, r: 0.05, w: 2.0 },
  { cx: 0.35, cy: 0.36, r: 0.04, w: 2.5 },
  { cx: 0.32, cy: 0.30, r: 0.04, w: 1.5 },
];

function computeImportance(nx, ny) {
  let imp = 0;
  for (const reg of IMPORTANCE_REGIONS) {
    const dx = nx - reg.cx;
    const dy = ny - reg.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < reg.r) {
      const t = 1 - dist / reg.r;
      imp += reg.w * t * t;
    }
  }
  return imp;
}

function computeEdges(lum, w, h) {
  const edges = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const tl = lum[(y - 1) * w + (x - 1)];
      const t = lum[(y - 1) * w + x];
      const tr = lum[(y - 1) * w + (x + 1)];
      const l = lum[y * w + (x - 1)];
      const r = lum[y * w + (x + 1)];
      const bl = lum[(y + 1) * w + (x - 1)];
      const b = lum[(y + 1) * w + x];
      const br = lum[(y + 1) * w + (x + 1)];
      const gx = -tl - 2 * l - bl + tr + 2 * r + br;
      const gy = -tl - 2 * t - tr + bl + 2 * b + br;
      edges[y * w + x] = Math.min(Math.sqrt(gx * gx + gy * gy), 1);
    }
  }
  return edges;
}

const NET_CONN_DIST = 0.055;

async function generateVariant(sampleSize, targetCount, targetNetwork) {
  const { data, info } = await sharp(IMAGE_PATH)
    .resize(sampleSize, sampleSize)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const pixelCount = sampleSize * sampleSize;

  // luminance
  const lumRaw = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    lumRaw[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  const lumMap = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    lumMap[i] = Math.pow(lumRaw[i], 0.6);
  }

  // edges
  const edgeMap = computeEdges(lumMap, sampleSize, sampleSize);
  const edgeMapFine = computeEdges(lumRaw, sampleSize, sampleSize);

  // importance
  const impMap = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const px = i % sampleSize;
    const py = Math.floor(i / sampleSize);
    impMap[i] = computeImportance(px / sampleSize, py / sampleSize);
  }

  // weights + CDF
  const weights = new Float32Array(pixelCount);
  let totalWeight = 0;
  for (let i = 0; i < pixelCount; i++) {
    const lum = lumMap[i];
    const edge = edgeMap[i];
    const edgeFine = edgeMapFine[i];
    const imp = impMap[i];
    const densityW = lum * 0.8 + edge * 4.0 + edgeFine * 3.0 + (lum > 0.04 ? 0.04 : 0);
    const importanceW = imp;
    const w = densityW * 1.0 + importanceW * 2.5;
    weights[i] = w;
    totalWeight += w;
  }

  const cdf = new Float32Array(pixelCount);
  let cumulative = 0;
  for (let i = 0; i < pixelCount; i++) {
    cumulative += weights[i] / totalWeight;
    cdf[i] = cumulative;
  }

  // sample particles
  const particles = [];
  let networkCount = 0;

  for (let p = 0; p < targetCount; p++) {
    const r = Math.random();
    let lo = 0,
      hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }

    const py = Math.floor(lo / sampleSize);
    const px = lo % sampleSize;
    const nx = (px + Math.random() - 0.5) / sampleSize;
    const ny = (py + Math.random() - 0.5) / sampleSize;

    const lum = lumMap[lo];
    const edge = edgeMap[lo];
    const edgeFine = edgeMapFine[lo];
    const imp = impMap[lo];
    const isEdge = edge > 0.12 || edgeFine > 0.10;
    const isImportant = imp > 1.0;
    const netChance = isImportant ? 0.14 : isEdge ? 0.06 : 0.02;
    const isNet =
      lum > 0.05 && networkCount < targetNetwork && Math.random() < netChance;
    if (isNet) networkCount++;

    const impBoost = Math.min(imp / 8.0, 0.6);

    const size = isNet
      ? 1.0 + lum * 2.5 + impBoost * 0.4
      : isEdge
        ? 0.3 + lum * 0.7 + impBoost * 0.1
        : 0.2 + lum * 0.5 + impBoost * 0.05;

    const brightness = isNet
      ? 0.25 + lum * 0.6 + impBoost * 0.1
      : isEdge
        ? 0.12 + lum * 0.45 + impBoost * 0.06
        : 0.03 + lum * 0.2 + impBoost * 0.03;

    // flags: bit 0 = isEdge/isImportant, bit 1 = isNetwork
    const flags = (isEdge || isImportant ? 1 : 0) | (isNet ? 2 : 0);

    // [x, y, size, brightness, flags] — rounded for compact JSON
    particles.push([
      Math.round(nx * 10000) / 10000,
      Math.round(ny * 10000) / 10000,
      Math.round(size * 100) / 100,
      Math.round(brightness * 1000) / 1000,
      flags,
    ]);
  }

  // sort: non-network first by brightness, then network
  particles.sort((a, b) => {
    const aNet = a[4] & 2;
    const bNet = b[4] & 2;
    if (aNet !== bNet) return aNet ? 1 : -1;
    return a[3] - b[3];
  });

  // build connections between network nodes
  const netIndices = [];
  for (let i = 0; i < particles.length; i++) {
    if (particles[i][4] & 2) netIndices.push(i);
  }

  const connections = [];
  for (let a = 0; a < netIndices.length; a++) {
    for (let b = a + 1; b < netIndices.length; b++) {
      const pa = particles[netIndices[a]];
      const pb = particles[netIndices[b]];
      const dx = pa[0] - pb[0];
      const dy = pa[1] - pb[1];
      if (Math.sqrt(dx * dx + dy * dy) < NET_CONN_DIST) {
        connections.push([netIndices[a], netIndices[b]]);
      }
    }
  }

  console.log(
    `  ${targetCount} particles (${networkCount} network), ${connections.length} connections`
  );
  return { particles, connections };
}

async function main() {
  console.log("Generating bear particle data...");

  console.log("Desktop variant (512px, 12000 particles):");
  const desktop = await generateVariant(512, 12000, 350);

  console.log("Mobile variant (256px, 1500 particles):");
  const mobile = await generateVariant(256, 1500, 60);

  const output = { desktop, mobile };
  const json = JSON.stringify(output);

  writeFileSync(OUTPUT_PATH, json);
  console.log(
    `\nWritten to ${OUTPUT_PATH} (${(json.length / 1024).toFixed(0)} KB raw)`
  );
}

main().catch(console.error);
