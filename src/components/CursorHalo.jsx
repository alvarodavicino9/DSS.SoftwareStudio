import { useEffect, useRef } from 'react';

/**
 * Small radial-gradient halo that follows the cursor over the hero background.
 * No trail, no particles — the client explicitly rejected both in earlier
 * revisions. Just a 46px glow that disappears the instant the cursor leaves.
 */
export default function CursorHalo({ heroRef, disabled = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const heroEl = heroRef.current;
    if (!canvas || !heroEl) return;
    const ctx = canvas.getContext('2d');
    const mouse = { x: 0, y: 0, active: false };
    let raf;

    const handleMouseMove = (e) => {
      const rect = heroEl.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const rect = heroEl.getBoundingClientRect();
      const rw = Math.round(rect.width);
      const rh = Math.round(rect.height);
      if (rw > 0 && rh > 0 && (canvas.width !== rw || canvas.height !== rh)) {
        canvas.width = rw;
        canvas.height = rh;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mouse.active) {
        ctx.globalCompositeOperation = 'lighter';
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 46);
        grad.addColorStop(0, 'rgba(182,171,252,0.22)');
        grad.addColorStop(0.5, 'rgba(145,132,217,0.1)');
        grad.addColorStop(1, 'rgba(145,132,217,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 46, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    };
    loop();

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [heroRef, disabled]);

  if (disabled) return null;
  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
