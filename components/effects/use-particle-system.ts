import { PARTICLE_CONFIG } from "@/lib/constants";

export type ParticleMode = "terminal" | "site";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
}

export interface ParticleSystem {
  start: () => void;
  stop: () => void;
  setMode: (mode: ParticleMode) => void;
  burst: () => void;
  resize: (width: number, height: number) => void;
}

export function createParticleSystem(
  canvas: HTMLCanvasElement,
  initialMode: ParticleMode = "terminal",
  reducedMotion: boolean = false
): ParticleSystem {
  const ctx = canvas.getContext("2d")!;
  let width = canvas.width;
  let height = canvas.height;
  let animationId: number | null = null;
  let mode = initialMode;
  let particles: Particle[] = [];
  let isBursting = false;

  function getConfig() {
    return PARTICLE_CONFIG[mode];
  }

  function isMobile() {
    return width < 768;
  }

  function createParticle(config = getConfig()): Particle {
    const { opacity, size, speed } = config;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: size.min + Math.random() * (size.max - size.min),
      opacity:
        opacity.min + Math.random() * (opacity.max - opacity.min),
      baseOpacity:
        opacity.min + Math.random() * (opacity.max - opacity.min),
    };
  }

  function initParticles() {
    const config = getConfig();
    const count = isMobile() ? config.countMobile : config.count;
    particles = Array.from({ length: count }, () => createParticle());
  }

  function updateParticle(p: Particle) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    if (isBursting) {
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.opacity = Math.max(p.opacity * 0.99, p.baseOpacity);
      if (Math.abs(p.vx) < 0.3 && Math.abs(p.vy) < 0.3) {
        const config = getConfig();
        p.vx = (Math.random() - 0.5) * config.speed;
        p.vy = (Math.random() - 0.5) * config.speed;
      }
    }
  }

  function drawParticles() {
    const config = getConfig();
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      updateParticle(p);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      if (config.connectionDistance > 0) {
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = config.color;
            ctx.globalAlpha =
              config.connectionOpacity *
              (1 - dist / config.connectionDistance);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    ctx.globalAlpha = 1;
  }

  function drawStaticParticles() {
    const config = getConfig();
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function loop() {
    drawParticles();
    animationId = requestAnimationFrame(loop);
  }

  function start() {
    if (animationId !== null) return;
    initParticles();
    if (reducedMotion) {
      drawStaticParticles();
      return;
    }
    loop();
  }

  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function setModeImpl(newMode: ParticleMode) {
    mode = newMode;
    const config = getConfig();
    const targetCount = isMobile() ? config.countMobile : config.count;

    while (particles.length < targetCount) {
      particles.push(createParticle(config));
    }
    while (particles.length > targetCount) {
      particles.pop();
    }

    for (const p of particles) {
      p.baseOpacity =
        config.opacity.min +
        Math.random() * (config.opacity.max - config.opacity.min);
    }
  }

  function burst() {
    isBursting = true;
    const cx = width / 2;
    const cy = height / 2;

    for (const p of particles) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const force = 8 + Math.random() * 4;
      p.vx = (dx / dist) * force;
      p.vy = (dy / dist) * force;
      p.opacity = Math.min(p.opacity * 3, 0.8);
    }

    setTimeout(() => {
      isBursting = false;
    }, 2000);
  }

  function resize(w: number, h: number) {
    width = w;
    height = h;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    if (reducedMotion && particles.length > 0) {
      drawStaticParticles();
    }
  }

  return { start, stop, setMode: setModeImpl, burst, resize };
}
