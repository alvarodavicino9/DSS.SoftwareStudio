import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useInteractionMount } from '../hooks/useDeferredMount';
import { trackEvent } from '../utils/analytics';
import { ANOTADOR_URL } from '../data/apps';
import SpotlightButton from './SpotlightButton';

// three.js is a heavy dependency (~700kB) used only by the 3D hero visuals —
// split into their own chunk so it doesn't block the initial page render.
const HeroFigure = lazy(() => import('./HeroFigure'));
const TechNetwork = lazy(() => import('./TechNetwork'));

export default function Hero() {
  const heroRef = useRef(null);
  const wrapRef = useRef(null);
  const reducedMotion = useReducedMotion();
  // Celular/tablet (layout apilado, < 861px): mismo robot 3D que en
  // escritorio (sigue al dedo al tocar la pantalla), con la red 3D de fondo
  // omitida para no abrir un segundo contexto WebGL en el teléfono.
  const [small] = useState(() => typeof window !== 'undefined' && window.innerWidth < 861);
  // La red 3D de fondo del Hero es un segundo contexto WebGL: también se omite
  // en equipos modestos o con ahorro de datos (el fondo claro queda igual de
  // prolijo).
  const [lowEnd] = useState(
    () =>
      typeof window !== 'undefined' &&
      ((navigator.hardwareConcurrency || 8) <= 4 || navigator.connection?.saveData === true)
  );
  // Rendimiento: al cargar se muestra una imagen fija del robot (su misma pose
  // de reposo) y el 3D arranca con la primera interacción real — mover el
  // mouse, tocar la pantalla o scrollear (ver useInteractionMount). Así el
  // contenido aparece al instante y three.js no compite con la carga de la
  // página. La imagen se saca apenas el 3D ya se está viendo encima.
  const show3D = useInteractionMount(true);
  const [posterGone, setPosterGone] = useState(false);
  useEffect(() => {
    if (!show3D) return;
    const t = setTimeout(() => setPosterGone(true), 1200);
    return () => clearTimeout(t);
  }, [show3D]);

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
      {/* El Hero mantiene su paleta clara original — ver el bloque
          "#hero-section" en layout.css, que resetea los tokens de color acá
          adentro. El robot 3D (HeroFigure.jsx) tiene materiales oscuros
          pensados para leerse por contraste sobre fondo claro; con el resto
          del sitio en tema oscuro (tokens.css v5) se perdía. */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: 'var(--color-bg)' }}>
        {show3D && !small && !lowEnd && (
          <Suspense fallback={null}>
            <TechNetwork containerRef={heroRef} reducedMotion={reducedMotion} />
          </Suspense>
        )}
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
            Ningún negocio es igual a otro, y tampoco debería serlo su solución. Vos marcás cómo trabajás; nosotros construimos la solución exacta que necesitás.
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
              Contanos tu proyecto
            </SpotlightButton>
            <SpotlightButton href="#portafolio" className="btn btn-secondary" glowColor="rgba(139,124,246,0.4)">
              Ver proyectos
            </SpotlightButton>
          </div>
          {/* Abre el anotador directo (pestaña nueva) en vez de bajar a #apps:
              así el texto, la flecha ↗ y el evento de analytics dicen lo mismo
              — ver README v17. */}
          <div className="fade-up-item" style={{ animation: 'fadeUp 1s var(--ease-cinematic) 0.32s both' }}>
            <a
              href={ANOTADOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-app-chip"
              onClick={() => trackEvent('cta_click', { label: 'abrir_anotador', location: 'hero' })}
            >
              Nuevo: Anotador de Truco <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div
          id="hero-figure-wrap"
          ref={wrapRef}
          style={{ position: 'absolute', right: '-6%', top: 0, width: '56%', height: '100%', zIndex: 1 }}
        >
          {!posterGone && (
            <img
              className="hero-robot-static"
              src={small ? '/hero/robot-2x.webp' : '/hero/robot-d-1x.webp'}
              srcSet={
                small
                  ? '/hero/robot-2x.webp 2x, /hero/robot-3x.webp 3x'
                  : '/hero/robot-d-1x.webp 1x, /hero/robot-d-2x.webp 2x'
              }
              width={small ? 281 : 787}
              height={small ? 240 : 690}
              alt=""
              aria-hidden="true"
              decoding="async"
            />
          )}
          {show3D && (
            <Suspense fallback={null}>
              <div className="hero-figure-in" style={{ width: '100%', height: '100%' }}>
                <HeroFigure wrapRef={wrapRef} followSpeed={0.08} reducedMotion={reducedMotion} />
              </div>
            </Suspense>
          )}
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
          // Un poco más oscuro que --text-secondary: a 11px necesita contraste 4.5:1.
          color: '#5c5d66',
          animation: 'bounceHint 2.2s ease-in-out infinite',
        }}
      >
        <span>Scroll</span>
        <div style={{ width: 1, height: 26, background: 'linear-gradient(to bottom, var(--text-faint), transparent)' }} />
      </div>
    </section>
  );
}
