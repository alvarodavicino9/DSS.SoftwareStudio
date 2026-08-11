import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const INTENSITY = {
  sutil: { dist: 26, dur: 0.6, stagger: 0.06 },
  marcada: { dist: 60, dur: 0.9, stagger: 0.08 },
  cinematografica: { dist: 110, dur: 1.25, stagger: 0.11 },
};

/**
 * One IntersectionObserver per section. Fires once (unobserves on entry) so the
 * reveal never repeats when scrolling back up. Returns [ref, visible].
 */
export function useReveal({ threshold = 0.18 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  return [ref, visible];
}

/**
 * Returns a style object for a staggered reveal item within an already-visible
 * section. `index` drives the stagger delay; `intensity` picks the preset.
 *
 * Deliberately opacity+transform only — no `filter: blur()`. Blur forces the
 * browser to repaint actual pixels every frame instead of just compositing a
 * layer, and this fires on every section as it scrolls into view. It was a
 * real contributor to the page feeling heavy, on top of the hero video.
 */
export function revealStyle(visible, index = 0, intensity = 'cinematografica', extra = {}) {
  const cfg = INTENSITY[intensity] || INTENSITY.cinematografica;
  const delay = Math.max(0, index) * cfg.stagger;
  const cine = intensity === 'cinematografica';
  const hiddenTransform = `translateY(${cfg.dist}px) scale(0.94)${cine ? ' rotateX(10deg)' : ''}`;
  return {
    ...extra,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1) rotateX(0deg)' : hiddenTransform,
    transformOrigin: 'center bottom',
    transition: `opacity ${cfg.dur}s var(--ease-cinematic) ${delay}s, transform ${cfg.dur}s var(--ease-cinematic) ${delay}s`,
  };
}
