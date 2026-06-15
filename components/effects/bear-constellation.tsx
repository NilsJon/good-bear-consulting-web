"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import bearData from "@/lib/bear-particles.json";

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

    function initFromPrecomputed(
      rawParticles: number[][],
      rawConns: number[][]
    ) {
      const particles: Particle[] = rawParticles.map((p) => {
        const [x, y, size, brightness, flags] = p;
        const isEdge = !!(flags & 1);
        const isNetwork = !!(flags & 2);
        return {
          x, y, baseX: x, baseY: y,
          size, brightness,
          isEdge, isNetwork,
          luminance: brightness,
          driftSpeed: 0.12 + Math.random() * 0.3,
          driftOffset: Math.random() * Math.PI * 2,
          driftAmp: isNetwork ? 0.002 : 0.001 + Math.random() * 0.003,
        };
      });

      const conns = rawConns as [number, number][];

      const shuffled = [...conns].sort(() => Math.random() - 0.5);
      const flows: FlowDot[] = shuffled.slice(0, Math.min(25, conns.length)).map((c) => ({
        fromIdx: c[0], toIdx: c[1],
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        brightness: 0.3 + Math.random() * 0.35,
      }));

      const curveFlows: CurveFlow[] = [];
      for (let i = 0; i < FLOW_CURVES.length; i++) {
        for (let j = 0; j < 3; j++) {
          curveFlows.push({ curveIdx: i, progress: Math.random(), speed: 0.001 + Math.random() * 0.003 });
        }
      }

      dataRef.current = {
        particles, conns, flows, curveFlows,
        vels: particles.map(() => ({ vx: 0, vy: 0 })),
      };
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

    // init from inlined pre-computed data (no network request)
    const isMobile = sizeRef.current.w < 768;
    const variant = isMobile ? bearData.mobile : bearData.desktop;
    initFromPrecomputed(variant.particles, variant.connections);

    if (reducedMotion) {
      draw(0);
    } else {
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
