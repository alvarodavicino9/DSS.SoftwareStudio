import { useEffect, useRef, lazy, Suspense } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { trackEvent } from '../utils/analytics';
import SpotlightButton from './SpotlightButton';

// three.js is a heavy dependency (~700kB) used only by the 3D hero visuals —
// split into their own chunk so it doesn't block the initial page render.
const HeroFigure = lazy(() => import('./HeroFigure'));
const TechNetwork = lazy(() => import('./TechNetwork'));

export default function Hero() {
  const heroRef = useRef(null);
  const wrapRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Scroll parallax on the figure wrap — sinks, shrinks and fades as the
  // first section enters. Skipped under prefers-reduced-motion.
  useEffect(() => {
    if (reducedMotion) return;
    const handleScroll = () => {
      const wrap = wrapRef.current;
      const heroEl = heroRef.current;
      if (!wrap || !heroEl) return;
      const heroH = heroEl.offsetHeight;
      const y = window.scrollY;
      const progress = Math.min(1, y / heroH);
      wrap.style.transform = `translateY(${y * 0.22}px) scale(${1 - progress * 0.14})`;
      wrap.style.opacity = String(1 - progress * 0.85);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <section
      id="hero-section"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        paddingTop: 'clamp(88px, 22vw, 112px)',
        paddingRight: 'clamp(20px, 6vw, 40px)',
        paddingBottom: 'clamp(24px, 6vw, 32px)',
        paddingLeft: 'clamp(20px, 6vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: 'var(--color-bg)' }}>
        <Suspense fallback={null}>
          <TechNetwork containerRef={heroRef} reducedMotion={reducedMotion} />
        </Suspense>
      </div>

      <div id="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
        <div
          className="fade-up-item hero-copy"
          style={{
            maxWidth: 600,
            position: 'relative',
            zIndex: 2,
            animation: 'fadeUp 1s var(--ease-cinematic) both',
          }}
        >
          <span className="tag tag-outline" style={{ marginBottom: 'var(--space-6)', display: 'inline-flex' }}>
            Consultoría de Software
          </span>
          <h1
            className="fade-up-item"
            style={{
              fontSize: 'clamp(32px, 7.5vw, 54px)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              margin: '20px 0 20px',
              animation: 'fadeUp 1s var(--ease-cinematic) 0.08s both',
            }}
          >
            Transformamos problemas en <span className="grad-text">software a medida</span>
          </h1>
          <p
            className="fade-up-item"
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: 480,
              margin: '0 0 32px',
              animation: 'fadeUp 1s var(--ease-cinematic) 0.16s both',
            }}
          >
            Diseñamos y programamos software a medida para tu negocio. Trabajás directo con los
            ingenieros que escriben tu código, de principio a fin.
          </p>
          <div
            className="fade-up-item hero-cta-row"
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeUp 1s var(--ease-cinematic) 0.24s both' }}
          >
            <SpotlightButton
              href="#contacto"
              className="btn btn-primary"
              onClick={() => trackEvent('cta_click', { label: 'agendar_consulta', location: 'hero' })}
            >
              Agendar una Consulta
            </SpotlightButton>
            <SpotlightButton href="#portafolio" className="btn btn-secondary" glowColor="rgba(139,124,246,0.4)">
              Ver Experiencia
            </SpotlightButton>
          </div>
        </div>

        <div
          id="hero-figure-wrap"
          ref={wrapRef}
          style={{ position: 'absolute', right: '-6%', top: 0, width: '56%', height: '100%', zIndex: 1 }}
        >
          <Suspense fallback={null}>
            <HeroFigure wrapRef={wrapRef} followSpeed={0.08} reducedMotion={reducedMotion} />
          </Suspense>
        </div>
      </div>

      <div
        className="scroll-hint"
        style={{
          flexShrink: 0,
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          width: 'fit-content',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          animation: 'bounceHint 2.2s ease-in-out infinite',
        }}
      >
        <span>Scroll</span>
        <div style={{ width: 1, height: 26, background: 'linear-gradient(to bottom, var(--text-faint), transparent)' }} />
      </div>
    </section>
  );
}
