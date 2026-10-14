import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   OceanBackground
   Canvas-based deep-ocean microplastic particle
   animation.  Sits at z-index -1 behind all UI.
   ───────────────────────────────────────────── */

// ── helpers ──────────────────────────────────
const rand  = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

// Particle "kinds" mimicking real microplastic morphologies
const KINDS = ['dot', 'fiber', 'fragment', 'film', 'pellet'];

function createParticle(W, H) {
  const kind = KINDS[randInt(0, KINDS.length)];
  const baseAlpha = rand(0.08, 0.38);

  // colour palette: whites, pale blues, pale greens, greys
  const PALETTES = [
    `rgba(255,255,255,${baseAlpha})`,
    `rgba(180,230,240,${baseAlpha})`,
    `rgba(200,210,230,${baseAlpha})`,
    `rgba(160,200,210,${baseAlpha})`,
    `rgba(220,240,250,${baseAlpha})`,
    `rgba(190,215,200,${baseAlpha})`,
  ];

  return {
    kind,
    x: rand(0, W),
    y: rand(-H * 0.1, H * 1.1),
    len:   kind === 'fiber' ? rand(12, 40) : rand(4, 14),
    angle: rand(0, Math.PI * 2),
    w:     kind === 'fiber' ? rand(0.8, 2) : rand(3, 10),
    h:     kind === 'fiber' ? rand(0.8, 2) : rand(3, 10),
    vy:    rand(-0.25, -0.06),
    vx:    rand(-0.12, 0.12),
    rot:   rand(-0.005, 0.005),
    wobble: rand(0.002, 0.012),
    wobblePhase: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.008, 0.025),
    color: PALETTES[randInt(0, PALETTES.length)],
    alpha: baseAlpha,
    pulsePhase: rand(0, Math.PI * 2),
    pulseSpeed: rand(0.01, 0.03),
  };
}

// ── drawing helpers ───────────────────────────
function drawDot(ctx, p) {
  const r = p.w * 0.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawPellet(ctx, p) {
  const rx = p.w * 0.7, ry = p.h * 0.45;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFiber(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.lineWidth = p.w;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-p.len / 2, 0);
  ctx.quadraticCurveTo(0, p.h * 2, p.len / 2, 0);
  ctx.stroke();
  ctx.restore();
}

function drawFragment(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  const hw = p.w * 0.6, hh = p.h * 0.6;
  ctx.beginPath();
  ctx.moveTo(-hw, -hh * 0.3);
  ctx.lineTo(-hw * 0.2, -hh);
  ctx.lineTo(hw * 0.7, -hh * 0.5);
  ctx.lineTo(hw, hh * 0.2);
  ctx.lineTo(hw * 0.3, hh);
  ctx.lineTo(-hw * 0.6, hh * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFilm(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  const w = p.w * 1.4, h = p.h * 0.6;
  ctx.beginPath();
  ctx.moveTo(-w, -h);
  ctx.bezierCurveTo(-w * 0.5, -h * 1.5, w * 0.5, -h * 0.5, w, -h * 0.2);
  ctx.bezierCurveTo(w * 0.8, h * 0.5, -w * 0.3, h * 1.2, -w, h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawParticle(ctx, p, tick) {
  const pulse = Math.sin(tick * p.pulseSpeed + p.pulsePhase) * 0.06;
  const a = Math.min(Math.max(p.alpha + pulse, 0.02), 0.55);
  ctx.globalAlpha = a;
  ctx.fillStyle   = p.color;
  ctx.strokeStyle = p.color;

  switch (p.kind) {
    case 'dot':      drawDot(ctx, p);      break;
    case 'pellet':   drawPellet(ctx, p);   break;
    case 'fiber':    drawFiber(ctx, p);    break;
    case 'fragment': drawFragment(ctx, p); break;
    case 'film':     drawFilm(ctx, p);     break;
    default:         drawDot(ctx, p);
  }
  ctx.globalAlpha = 1;
}

// ── caustic light rays ────────────────────────
function drawCaustics(ctx, W, H, tick) {
  const rays = [
    { x: W * 0.15, w: 60,  a: 0.025 },
    { x: W * 0.38, w: 90,  a: 0.018 },
    { x: W * 0.55, w: 50,  a: 0.022 },
    { x: W * 0.72, w: 110, a: 0.015 },
    { x: W * 0.88, w: 40,  a: 0.020 },
  ];

  rays.forEach((ray, i) => {
    const sway = Math.sin(tick * 0.004 + i * 1.3) * 18;
    const fade = 0.5 + 0.5 * Math.sin(tick * 0.006 + i * 0.9);
    const alpha = ray.a * fade;

    const grad = ctx.createLinearGradient(ray.x + sway, 0, ray.x + sway, H * 0.65);
    grad.addColorStop(0,   `rgba(120,200,230,${alpha})`);
    grad.addColorStop(0.5, `rgba(80,160,200,${alpha * 0.5})`);
    grad.addColorStop(1,   `rgba(0,0,0,0)`);

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(ray.x + sway - ray.w * 0.5, 0);
    ctx.lineTo(ray.x + sway + ray.w * 0.5, 0);
    ctx.lineTo(ray.x + sway + ray.w * 2,   H * 0.65);
    ctx.lineTo(ray.x + sway - ray.w * 2,   H * 0.65);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

// ── main component ────────────────────────────
export default function OceanBackground({ particleCount = 180 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0;
    let particles = [];
    let rafId;
    let tick = 0;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      particles = Array.from({ length: particleCount }, () => createParticle(W, H));
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function buildGradient() {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0.00, '#0a2540');
      g.addColorStop(0.15, '#07243d');
      g.addColorStop(0.40, '#051c35');
      g.addColorStop(0.65, '#040f22');
      g.addColorStop(1.00, '#020810');
      return g;
    }

    function loop() {
      rafId = requestAnimationFrame(loop);
      tick++;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = buildGradient();
      ctx.fillRect(0, 0, W, H);

      drawCaustics(ctx, W, H, tick);

      for (const p of particles) {
        p.x += p.vx + Math.sin(tick * p.wobbleSpeed + p.wobblePhase) * p.wobble;
        p.y += p.vy;
        p.angle += p.rot;

        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;

        if (p.y < -50) {
          const fresh = createParticle(W, H);
          fresh.y = H + rand(0, 60);
          Object.assign(p, fresh);
        }

        drawParticle(ctx, p, tick);
      }
    }

    loop();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
