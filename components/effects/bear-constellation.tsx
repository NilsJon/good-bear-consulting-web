"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// ── helpers ──

function cubicBezier(
  p0: [number, number], p1: [number, number],
  p2: [number, number], p3: [number, number], t: number
): [number, number] {
  const u = 1 - t, uu = u * u, uuu = uu * u;
  const tt = t * t, ttt = tt * t;
  return [
    uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
    uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1],
  ];
}

const FLOW_CURVES = [
  { pts: [[0.70, 0.25], [0.84, 0.14], [0.94, 0.08], [1.05, 0.04]] as [number, number][], width: 0.8, opacity: 0.12 },
  { pts: [[0.85, 0.60], [0.93, 0.58], [1.0, 0.62], [1.08, 0.68]] as [number, number][], width: 0.6, opacity: 0.10 },
  { pts: [[0.60, 0.75], [0.68, 0.85], [0.76, 0.92], [0.86, 1.02]] as [number, number][], width: 0.7, opacity: 0.08 },
  { pts: [[0.25, 0.35], [0.14, 0.28], [0.06, 0.24], [-0.04, 0.22]] as [number, number][], width: 0.5, opacity: 0.06 },
  { pts: [[0.30, 0.78], [0.22, 0.86], [0.14, 0.93], [0.04, 1.0]] as [number, number][], width: 0.6, opacity: 0.06 },
];

const LABELS = [
  { lines: ["STRATEGY", "CLARITY"], pos: [0.92, 0.16] as [number, number] },
  { lines: ["TECHNOLOGY", "ADVANTAGE"], pos: [0.94, 0.48] as [number, number] },
  { lines: ["BUILDING", "FORWARD"], pos: [0.93, 0.78] as [number, number] },
];

// ── types ──

interface Particle {
  x: number; y: number;
  baseX: number; baseY: number;
  size: number;
  brightness: number;
  isEdge: boolean;
  isNetwork: boolean;
  luminance: number;
  driftSpeed: number;
  driftOffset: number;
  driftAmp: number;
}

interface FlowDot {
  fromIdx: number; toIdx: number;
  progress: number; speed: number; brightness: number;
}

interface CurveFlow {
  curveIdx: number; progress: number; speed: number;
}

const CYAN = { r: 6, g: 182, b: 212 };
const BLUE = { r: 59, g: 130, b: 246 };
const MOUSE_RADIUS = 0.05;
const MOUSE_FORCE = 0.012;
const SPRING = 0.055;
const DAMPING = 0.84;
const NET_CONN_DIST = 0.055;

export function BearConstellation({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dataRef = useRef<{
    particles: Particle[];
    conns: [number, number][];
    flows: FlowDot[];
    curveFlows: CurveFlow[];
    vels: { vx: number; vy: number }[];
  } | null>(null);
  const animRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const glowRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const initDone = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // glow sprite
    const gs = 64;
    const gc = document.createElement("canvas");
    gc.width = gs; gc.height = gs;
    const gg = gc.getContext("2d")!;
    const gr = gg.createRadialGradient(gs / 2, gs / 2, 0, gs / 2, gs / 2, gs / 2);
    gr.addColorStop(0, `rgba(${CYAN.r},${CYAN.g},${CYAN.b},0.5)`);
    gr.addColorStop(0.25, `rgba(${CYAN.r},${CYAN.g},${CYAN.b},0.12)`);
    gr.addColorStop(1, `rgba(${CYAN.r},${CYAN.g},${CYAN.b},0)`);
    gg.fillStyle = gr;
    gg.fillRect(0, 0, gs, gs);
    glowRef.current = gc;

    function bearRegion() {
      const { w, h } = sizeRef.current;
      if (w < 768) return { x: w * 0.10, y: h * 0.08, bw: w * 0.80, bh: h * 0.75 };
      return { x: w * 0.30, y: h * 0.03, bw: w * 0.60, bh: h * 0.88 };
    }

    function toCanvas(nx: number, ny: number): [number, number] {
      const r = bearRegion();
      return [r.x + nx * r.bw, r.y + ny * r.bh];
    }

    function toNorm(cx: number, cy: number): [number, number] {
      const r = bearRegion();
      return [(cx - r.x) / r.bw, (cy - r.y) / r.bh];
    }

    // Sobel edge detection on luminance map
    function computeEdges(lum: Float32Array, w: number, h: number): Float32Array {
      const edges = new Float32Array(w * h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const tl = lum[(y - 1) * w + (x - 1)];
          const t  = lum[(y - 1) * w + x];
          const tr = lum[(y - 1) * w + (x + 1)];
          const l  = lum[y * w + (x - 1)];
          const r  = lum[y * w + (x + 1)];
          const bl = lum[(y + 1) * w + (x - 1)];
          const b  = lum[(y + 1) * w + x];
          const br = lum[(y + 1) * w + (x + 1)];
          const gx = -tl - 2 * l - bl + tr + 2 * r + br;
          const gy = -tl - 2 * t - tr + bl + 2 * b + br;
          edges[y * w + x] = Math.min(Math.sqrt(gx * gx + gy * gy), 1);
        }
      }
      return edges;
    }

    // ── importance map: feature regions that define "bear" recognition ──
    // Each region: center (x, y in 0-1 image space), radius, weight
    const IMPORTANCE_REGIONS = [
      // Focal points (5.0)
      { cx: 0.38, cy: 0.42, r: 0.025, w: 5.0 },  // eye center
      { cx: 0.25, cy: 0.55, r: 0.03, w: 5.0 },   // nostril
      // Facial features (2.0–3.0)
      { cx: 0.36, cy: 0.40, r: 0.05, w: 2.5 },   // eye socket
      { cx: 0.30, cy: 0.50, r: 0.04, w: 3.0 },   // nose bridge
      { cx: 0.27, cy: 0.58, r: 0.03, w: 2.5 },   // upper lip
      { cx: 0.30, cy: 0.61, r: 0.05, w: 3.0 },   // mouth line
      { cx: 0.36, cy: 0.67, r: 0.04, w: 2.0 },   // chin
      { cx: 0.42, cy: 0.70, r: 0.06, w: 2.0 },   // jawline
      { cx: 0.50, cy: 0.72, r: 0.06, w: 1.8 },   // jawline mid
      { cx: 0.58, cy: 0.72, r: 0.06, w: 1.5 },   // jawline back
      { cx: 0.55, cy: 0.76, r: 0.07, w: 1.2 },   // neck
      { cx: 0.38, cy: 0.18, r: 0.05, w: 2.0 },   // ear
      { cx: 0.45, cy: 0.12, r: 0.05, w: 2.0 },   // ear
      { cx: 0.35, cy: 0.36, r: 0.04, w: 2.5 },   // brow ridge
      { cx: 0.32, cy: 0.30, r: 0.04, w: 1.5 },   // forehead
    ];

    function computeImportance(nx: number, ny: number): number {
      let imp = 0;
      for (const reg of IMPORTANCE_REGIONS) {
        const dx = nx - reg.cx;
        const dy = ny - reg.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reg.r) {
          // smooth falloff within radius
          const t = 1 - dist / reg.r;
          imp += reg.w * t * t;
        }
      }
      return imp;
    }

    function initFromImage(img: HTMLImageElement) {
      const { w: canvasW } = sizeRef.current;
      const isMobile = canvasW < 768;

      const sampleSize = 512;
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleSize;
      offscreen.height = sampleSize;
      const octx = offscreen.getContext("2d")!;
      octx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imageData = octx.getImageData(0, 0, sampleSize, sampleSize);
      const pixels = imageData.data;

      // luminance maps
      const lumRaw = new Float32Array(sampleSize * sampleSize);
      for (let i = 0; i < sampleSize * sampleSize; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        lumRaw[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
      const lumMap = new Float32Array(sampleSize * sampleSize);
      for (let i = 0; i < sampleSize * sampleSize; i++) {
        lumMap[i] = Math.pow(lumRaw[i], 0.6);
      }

      // edge maps (dual pass)
      const edgeMap = computeEdges(lumMap, sampleSize, sampleSize);
      const edgeMapFine = computeEdges(lumRaw, sampleSize, sampleSize);

      // importance map (per-pixel, based on feature regions)
      const impMap = new Float32Array(sampleSize * sampleSize);
      for (let i = 0; i < sampleSize * sampleSize; i++) {
        const px = i % sampleSize;
        const py = Math.floor(i / sampleSize);
        const nx = px / sampleSize;
        const ny = py / sampleSize;
        impMap[i] = computeImportance(nx, ny);
      }

      // generate particles
      const targetCount = isMobile ? 3000 : 12000;
      const targetNetwork = isMobile ? 120 : 350;
      const particles: Particle[] = [];
      let networkCount = 0;

      // combined weight: density + importance (importance dominates)
      const weights = new Float32Array(sampleSize * sampleSize);
      let totalWeight = 0;
      for (let i = 0; i < sampleSize * sampleSize; i++) {
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

      // CDF
      const cdf = new Float32Array(sampleSize * sampleSize);
      let cumulative = 0;
      for (let i = 0; i < sampleSize * sampleSize; i++) {
        cumulative += weights[i] / totalWeight;
        cdf[i] = cumulative;
      }

      // sample particles via inverse CDF
      for (let p = 0; p < targetCount; p++) {
        const r = Math.random();
        let lo = 0, hi = cdf.length - 1;
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

        // network nodes strongly prefer important + edge regions
        const netChance = isImportant ? 0.14 : (isEdge ? 0.06 : 0.02);
        const isNet = lum > 0.05 && networkCount < targetNetwork && Math.random() < netChance;
        if (isNet) networkCount++;

        // importance boosts size and brightness
        const impBoost = Math.min(imp / 8.0, 0.6);

        const baseSize = isNet
          ? 1.0 + lum * 2.5 + impBoost * 0.4
          : isEdge
            ? 0.3 + lum * 0.7 + impBoost * 0.1
            : 0.2 + lum * 0.5 + impBoost * 0.05;

        const baseBright = isNet
          ? 0.25 + lum * 0.6 + impBoost * 0.1
          : isEdge
            ? 0.12 + lum * 0.45 + impBoost * 0.06
            : 0.03 + lum * 0.2 + impBoost * 0.03;

        particles.push({
          x: nx, y: ny,
          baseX: nx, baseY: ny,
          size: baseSize,
          brightness: baseBright,
          isEdge: isEdge || isImportant,
          isNetwork: isNet,
          luminance: lum,
          driftSpeed: 0.12 + Math.random() * 0.3,
          driftOffset: Math.random() * Math.PI * 2,
          driftAmp: isNet ? 0.002 : 0.001 + Math.random() * 0.003,
        });
      }

      // sort: non-network first (back), network on top
      particles.sort((a, b) => {
        if (a.isNetwork !== b.isNetwork) return a.isNetwork ? 1 : -1;
        return a.brightness - b.brightness;
      });

      // network connections
      const netIndices = particles
        .map((p, i) => (p.isNetwork ? i : -1))
        .filter((i) => i >= 0);
      const conns: [number, number][] = [];
      for (let a = 0; a < netIndices.length; a++) {
        for (let b = a + 1; b < netIndices.length; b++) {
          const pa = particles[netIndices[a]];
          const pb = particles[netIndices[b]];
          const dx = pa.baseX - pb.baseX;
          const dy = pa.baseY - pb.baseY;
          if (Math.sqrt(dx * dx + dy * dy) < NET_CONN_DIST) {
            conns.push([netIndices[a], netIndices[b]]);
          }
        }
      }

      // flow dots
      const shuffled = [...conns].sort(() => Math.random() - 0.5);
      const flows: FlowDot[] = shuffled.slice(0, Math.min(25, conns.length)).map((c) => ({
        fromIdx: c[0], toIdx: c[1],
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        brightness: 0.3 + Math.random() * 0.35,
      }));

      // curve flows
      const curveFlows: CurveFlow[] = [];
      for (let i = 0; i < FLOW_CURVES.length; i++) {
        for (let j = 0; j < 3; j++) {
          curveFlows.push({ curveIdx: i, progress: Math.random(), speed: 0.001 + Math.random() * 0.003 });
        }
      }

      dataRef.current = {
        particles,
        conns,
        flows,
        curveFlows,
        vels: particles.map(() => ({ vx: 0, vy: 0 })),
      };

      initDone.current = true;
    }

    function handleResize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
    }

    // pre-computed alpha-bucketed color strings (avoids per-particle string alloc)
    const ABUCKETS = 32;
    const cyanA: string[] = [];
    const blueA: string[] = [];
    const whiteA: string[] = [];
    for (let i = 0; i <= ABUCKETS; i++) {
      const a = (i / ABUCKETS).toFixed(3);
      cyanA.push(`rgba(6,182,212,${a})`);
      blueA.push(`rgba(59,130,246,${a})`);
      whiteA.push(`rgba(255,255,255,${a})`);
    }
    function ai(a: number) { return Math.max(0, Math.min(ABUCKETS, (a * ABUCKETS + 0.5) | 0)); }

    let bgGrad: CanvasGradient | null = null;
    let bgCacheW = 0, bgCacheH = 0;
    const PI2 = Math.PI * 2;
    const MR2 = MOUSE_RADIUS * MOUSE_RADIUS;

    function draw(time: number) {
      const { w, h } = sizeRef.current;
      const data = dataRef.current;
      if (w === 0 || !data) { animRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, w, h);
      const { particles, conns, flows, curveFlows, vels } = data;
      const t = time * 0.001;

      const br = bearRegion();
      const bx = br.x, by = br.y, bw = br.bw, bh = br.bh;
      const mx = (mouseRef.current.x - bx) / bw;
      const my = (mouseRef.current.y - by) / bh;
      const mouseActive = mx > -0.5 && mx < 1.5 && my > -0.5 && my < 1.5;
      const isDesktop = w >= 1024;

      // cached background glow
      if (!bgGrad || bgCacheW !== w || bgCacheH !== h) {
        const gcx = bx + 0.45 * bw, gcy = by + 0.40 * bh;
        const gRad = Math.min(w, h) * 0.6;
        bgGrad = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, gRad);
        bgGrad.addColorStop(0, "rgba(6,182,212,0.035)");
        bgGrad.addColorStop(0.5, "rgba(59,130,246,0.012)");
        bgGrad.addColorStop(1, "rgba(0,0,0,0)");
        bgCacheW = w; bgCacheH = h;
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // update positions
      if (!reducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const v = vels[i];
          const driftX = Math.sin(t * p.driftSpeed + p.driftOffset) * p.driftAmp;
          const driftY = Math.cos(t * p.driftSpeed + p.driftOffset + 1.3) * p.driftAmp;
          const tx = p.baseX + driftX;
          const ty = p.baseY + driftY;

          let rx = 0, ry = 0;
          if (mouseActive) {
            const dmx = p.x - mx;
            const dmy = p.y - my;
            const dd = dmx * dmx + dmy * dmy;
            if (dd < MR2 && dd > 0.000001) {
              const md = Math.sqrt(dd);
              const f = (1 - md / MOUSE_RADIUS) * MOUSE_FORCE;
              rx = (dmx / md) * f;
              ry = (dmy / md) * f;
            }
          }

          v.vx = (v.vx + (tx - p.x) * SPRING + rx) * DAMPING;
          v.vy = (v.vy + (ty - p.y) * SPRING + ry) * DAMPING;
          p.x += v.vx;
          p.y += v.vy;
        }

        for (const f of flows) {
          f.progress += f.speed;
          if (f.progress > 1) {
            f.progress = 0;
            if (conns.length > 0) {
              const ci = (Math.random() * conns.length) | 0;
              f.fromIdx = conns[ci][0];
              f.toIdx = conns[ci][1];
            }
          }
        }
        for (const cf of curveFlows) {
          cf.progress += cf.speed;
          if (cf.progress > 1) cf.progress = 0;
        }
      }

      // flowing curves
      for (const curve of FLOW_CURVES) {
        const [a, b, c, d] = curve.pts;
        ctx.beginPath();
        ctx.moveTo(bx + a[0] * bw, by + a[1] * bh);
        ctx.bezierCurveTo(bx + b[0] * bw, by + b[1] * bh, bx + c[0] * bw, by + c[1] * bh, bx + d[0] * bw, by + d[1] * bh);
        ctx.strokeStyle = cyanA[ai(curve.opacity)];
        ctx.lineWidth = curve.width;
        ctx.stroke();
      }

      // curve flow dots
      if (!reducedMotion) {
        for (const cf of curveFlows) {
          const curve = FLOW_CURVES[cf.curveIdx];
          const [a, b, c, d] = curve.pts;
          const [px, py] = cubicBezier(a, b, c, d, cf.progress);
          ctx.beginPath();
          ctx.arc(bx + px * bw, by + py * bh, 1.5, 0, PI2);
          ctx.fillStyle = cyanA[ai(Math.sin(cf.progress * Math.PI) * 0.5)];
          ctx.fill();
        }
      }

      // network connections — batch into single path per alpha bucket
      ctx.lineWidth = 0.5;
      for (let bucket = 1; bucket <= ABUCKETS; bucket++) {
        ctx.beginPath();
        let any = false;
        for (let ci = 0; ci < conns.length; ci++) {
          const [i, j] = conns[ci];
          const pa = particles[i], pb = particles[j];
          const dxx = pa.x - pb.x, dyy = pa.y - pb.y;
          const dd = Math.sqrt(dxx * dxx + dyy * dyy);
          const alpha = (1 - dd / NET_CONN_DIST) * 0.12;
          const pulse = reducedMotion ? 1 : 0.7 + 0.3 * Math.sin(t * 0.4 + ci * 0.05);
          if (ai(alpha * pulse) === bucket) {
            ctx.moveTo(bx + pa.x * bw, by + pa.y * bh);
            ctx.lineTo(bx + pb.x * bw, by + pb.y * bh);
            any = true;
          }
        }
        if (any) { ctx.strokeStyle = cyanA[bucket]; ctx.stroke(); }
      }

      // flow dots
      if (!reducedMotion) {
        for (const f of flows) {
          const pa = particles[f.fromIdx], pb = particles[f.toIdx];
          if (!pa || !pb) continue;
          const fx = pa.x + (pb.x - pa.x) * f.progress;
          const fy = pa.y + (pb.y - pa.y) * f.progress;
          ctx.beginPath();
          ctx.arc(bx + fx * bw, by + fy * bh, 1.5, 0, PI2);
          ctx.fillStyle = cyanA[ai(Math.sin(f.progress * Math.PI) * f.brightness)];
          ctx.fill();
        }
      }

      // volume particles — batched by color + alpha bucket
      for (let bucket = 1; bucket <= ABUCKETS; bucket++) {
        ctx.beginPath();
        let anyCyan = false;
        for (const p of particles) {
          if (p.isNetwork || !p.isEdge || p.brightness < 0.005) continue;
          if (ai(p.brightness) !== bucket) continue;
          const cx2 = bx + p.x * bw, cy2 = by + p.y * bh;
          ctx.moveTo(cx2 + p.size, cy2);
          ctx.arc(cx2, cy2, p.size, 0, PI2);
          anyCyan = true;
        }
        if (anyCyan) { ctx.fillStyle = cyanA[bucket]; ctx.fill(); }

        ctx.beginPath();
        let anyBlue = false;
        for (const p of particles) {
          if (p.isNetwork || p.isEdge || p.brightness < 0.005) continue;
          if (ai(p.brightness) !== bucket) continue;
          const cx2 = bx + p.x * bw, cy2 = by + p.y * bh;
          ctx.moveTo(cx2 + p.size, cy2);
          ctx.arc(cx2, cy2, p.size, 0, PI2);
          anyBlue = true;
        }
        if (anyBlue) { ctx.fillStyle = blueA[bucket]; ctx.fill(); }
      }

      // network node glows
      const prevComp = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      const sprite = glowRef.current;
      if (sprite) {
        for (const p of particles) {
          if (!p.isNetwork) continue;
          const cx2 = bx + p.x * bw, cy2 = by + p.y * bh;
          const scale = p.size * (p.brightness > 0.45 ? 5 : 3.5);
          ctx.globalAlpha = p.brightness * 0.7;
          ctx.drawImage(sprite, cx2 - scale * 4, cy2 - scale * 4, scale * 8, scale * 8);
        }
      }
      ctx.globalCompositeOperation = prevComp;
      ctx.globalAlpha = 1;

      // network node cores
      for (const p of particles) {
        if (!p.isNetwork) continue;
        const cx2 = bx + p.x * bw, cy2 = by + p.y * bh;
        const isKey = p.brightness > 0.45;
        ctx.beginPath();
        ctx.arc(cx2, cy2, p.size, 0, PI2);
        ctx.fillStyle = isKey ? cyanA[ai(p.brightness)] : blueA[ai(p.brightness)];
        ctx.fill();
        if (isKey) {
          ctx.beginPath();
          ctx.arc(cx2, cy2, p.size * 0.4, 0, PI2);
          ctx.fillStyle = whiteA[ai(p.brightness * 0.7)];
          ctx.fill();
        }
      }

      // text labels (desktop)
      if (isDesktop) {
        for (const label of LABELS) {
          const lx = bx + label.pos[0] * bw, ly = by + label.pos[1] * bh;
          ctx.beginPath();
          ctx.arc(lx - 50, ly + 6, 2, 0, PI2);
          ctx.fillStyle = "rgba(6,182,212,0.25)";
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(lx - 48, ly + 6);
          ctx.lineTo(lx - 10, ly + 6);
          ctx.strokeStyle = "rgba(6,182,212,0.08)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.font = "10px var(--font-mono), monospace";
          ctx.fillStyle = "rgba(139,149,165,0.45)";
          ctx.textAlign = "left";
          ctx.fillText(label.lines[0], lx, ly);
          ctx.fillStyle = "rgba(224,230,237,0.55)";
          ctx.font = "11px var(--font-mono), monospace";
          ctx.fillText(label.lines[1], lx, ly + 14);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    handleResize();

    // load source image, sample particles from it
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      initFromImage(img);
      if (reducedMotion) {
        draw(0);
        cancelAnimationFrame(animRef.current);
      } else {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    img.src = "/bear-silloute.png";

    // start animation loop (will wait for data)
    if (!reducedMotion) {
      animRef.current = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
