import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Fondo animado de todo el sitio — reemplazo del degradé WebGL abstracto
// (AnimatedGradient.jsx, que queda en el repo sin usar) por algo con
// identidad propia: una red de nodos conectados con pulsos de datos
// viajando por las conexiones, mismo lenguaje visual que ya tenía el Hero
// (TechNetwork.jsx, three.js) pero portado a canvas 2D liviano para poder
// vivir detrás de TODA la página sin abrir un contexto WebGL por sección.
// Motivo del cambio: WebGL2 (lo que usaba AnimatedGradient) no está
// garantizado en todas las máquinas/navegadores — si `getContext('webgl2')`
// devuelve null (GPU bloqueada, sesión remota sin aceleración, etc.) el
// componente no rendereaba nada y solo quedaba visible la grilla de puntos
// estática de `.section-textured`. Canvas 2D tiene soporte prácticamente
// universal, así que esto no se cae silenciosamente.
//
// v2: red más densa + reactividad al mouse (probado antes en un preview
// standalone y aprobado). El cursor ilumina nodos/conexiones cercanas
// dentro de HOVER_RADIUS; en touch no hay mousemove así que simplemente
// no se activa (no hace falta detectar el dispositivo aparte).
const NODE_COUNT_DESKTOP = 170;
const NODE_COUNT_MOBILE = 80;
const CONNECT_DIST = 150;
const MAX_PULSES = 10;
const PULSE_SPAWN_CHANCE = 0.035;
const HOVER_RADIUS = 220;

const PURPLE = [139, 124, 246];
const CYAN = [47, 200, 219];
const BG = '#070812';

function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export default function TechBackground() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes = [];
    let pulses = [];
    let glowTL = null;
    let glowBR = null;
    let raf;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    function makeGlow(cx, cy, color, alpha) {
      const r = Math.max(width, height) * 0.85;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
      g.addColorStop(1, 'rgba(7, 8, 18, 0)');
      return g;
    }

    function init() {
      const count = width < 720 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      nodes = Array.from({ length: count }, () => {
        const t = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          color: lerpColor(PURPLE, CYAN, t),
        };
      });
      pulses = [];
      glowTL = makeGlow(width * 0.85, height * 0.08, PURPLE, 0.16);
      glowBR = makeGlow(width * 0.08, height * 0.95, CYAN, 0.13);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function draw() {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = glowTL;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = glowBR;
      ctx.fillRect(0, 0, width, height);

      if (mouse.active) {
        const hoverGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, HOVER_RADIUS * 1.6);
        hoverGlow.addColorStop(0, 'rgba(139, 124, 246, 0.14)');
        hoverGlow.addColorStop(1, 'rgba(7, 8, 18, 0)');
        ctx.fillStyle = hoverGlow;
        ctx.fillRect(0, 0, width, height);
      }

      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            let alpha = (1 - dist / CONNECT_DIST) * 0.22;
            let lineWidth = 1;
            if (mouse.active) {
              const mdx = (a.x + b.x) / 2 - mouse.x;
              const mdy = (a.y + b.y) / 2 - mouse.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < HOVER_RADIUS) {
                const boost = 1 - mdist / HOVER_RADIUS;
                alpha = Math.min(0.9, alpha + boost * 0.65);
                lineWidth = 1 + boost * 1.5;
              }
            }
            ctx.strokeStyle = `rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            edges.push([a, b]);
          }
        }
      }

      if (!reducedMotion && edges.length > 0 && pulses.length < MAX_PULSES && Math.random() < PULSE_SPAWN_CHANCE) {
        pulses.push({
          edge: edges[Math.floor(Math.random() * edges.length)],
          t: 0,
          speed: 0.006 + Math.random() * 0.01,
        });
      }

      pulses = pulses.filter((p) => p.t < 1);
      pulses.forEach((p) => {
        p.t += p.speed;
        const [a, b] = p.edge;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const c = a.color;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.22)`;
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.95)`;
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      nodes.forEach((n) => {
        let radius = 1.6;
        let alpha = 0.6;
        if (mouse.active) {
          const ndx = n.x - mouse.x;
          const ndy = n.y - mouse.y;
          const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
          if (ndist < HOVER_RADIUS) {
            const boost = 1 - ndist / HOVER_RADIUS;
            radius = 1.6 + boost * 2.4;
            alpha = Math.min(1, 0.6 + boost * 0.5);
            ctx.beginPath();
            ctx.fillStyle = `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${boost * 0.25})`;
            ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${alpha})`;
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function tick() {
      if (!reducedMotion) {
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        });
      }
      draw();
      if (!reducedMotion && running) raf = requestAnimationFrame(tick);
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        if (!raf && !reducedMotion) { running = true; raf = requestAnimationFrame(tick); }
      } else {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      }
    }

    function handlePointerMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function handlePointerLeave() {
      mouse.active = false;
    }

    resize();
    tick();

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: -2, display: 'block', background: BG }}
    />
  );
}
