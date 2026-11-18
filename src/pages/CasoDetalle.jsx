import { useReveal, revealStyle } from '../hooks/useReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackEvent } from '../utils/analytics';
import { Link } from '../router';
import Carousel from '../components/Carousel';
import BrowserBar from '../components/BrowserBar';
import { getCasoBySlug, CASOS } from '../data/casos';
import NotFound from '../components/NotFound';

export default function CasoDetalle({ slug }) {
  const [ref, visible] = useReveal({ threshold: 0 });
  const caso = getCasoBySlug(slug);

  // Un solo useDocumentMeta cubre los dos casos (llamado antes del early
  // return de abajo — reglas de hooks): si el slug no existe, robots pasa a
  // noindex para que Google no llegue a indexar /portafolio/algo-que-no-existe
  // como si fuera una página real. Nunca dos llamadas separadas para esto —
  // si NotFound tuviera su propia (efectos de hijo primero), pisaría el
  // noindex con el "index, follow" default de esta.
  useDocumentMeta({
    title: caso ? `${caso.seoTitulo || caso.nombre} | DS.SoftwareStudio` : 'Página no encontrada | DS.SoftwareStudio',
    description: caso ? caso.resumen : undefined,
    path: `/portafolio/${slug}`,
    robots: caso ? 'index, follow' : 'noindex, follow',
    image: caso?.imagenes?.[0],
    breadcrumb: caso
      ? [
          { name: 'Inicio', url: 'https://dssoftwarestudio.com.ar/' },
          { name: 'Portafolio', url: 'https://dssoftwarestudio.com.ar/#portafolio' },
          { name: caso.titulo, url: `https://dssoftwarestudio.com.ar/portafolio/${slug}` },
        ]
      : undefined,
  });

  if (!caso) return <NotFound titulo="No encontramos ese caso" texto="Puede que el link esté roto o el caso ya no exista." />;

  const otros = CASOS.filter((c) => c.slug !== caso.slug);

  return (
    <section className="section-textured caso-page" style={{ padding: '150px 40px 140px' }}>
      <div ref={ref} style={{ maxWidth: 940, margin: '0 auto', ...revealStyle(visible, 0) }}>
        <Link
          to="/#portafolio"
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-300)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}
        >
          ← Volver al portafolio
        </Link>

        <div className="section-header" style={{ marginBottom: 40 }}>
          <div className="section-kicker" />
          {caso.cliente && (
            <span className="tag tag-neutral" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              {caso.cliente}
            </span>
          )}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', margin: '0 0 14px', letterSpacing: '-0.015em' }}>
            {caso.titulo}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 620 }}>
            {caso.resumen}
          </p>
          {caso.url && (
            <a
              href={caso.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={() => trackEvent('portfolio_live_site_click', { caso: caso.slug })}
            >
              Ver sitio en vivo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>

        {caso.imagenes && caso.imagenes.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <Carousel images={caso.imagenes} alt={caso.titulo} />
          </div>
        )}

        {caso.funcionalidades && caso.funcionalidades.length > 0 && (
          <div className="card caso-card" style={{ padding: 'calc(var(--space-8) * 1.4)', marginBottom: 32 }}>
            <span className="card-kicker" style={{ display: 'block', marginBottom: 18 }}>Qué incluye</span>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px 24px',
              }}
            >
              {caso.funcionalidades.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    style={{ flexShrink: 0, marginTop: 3, color: 'var(--color-accent-300)' }}
                  >
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-text)' }}>{item}</span>
                </li>
              ))}
            </ul>

            {caso.stack && caso.stack.length > 0 && (
              <>
                <div style={{ height: 1, background: 'var(--border-neutral)', margin: '26px 0 20px' }} />
                <span className="card-kicker" style={{ display: 'block', marginBottom: 10 }}>Tecnología</span>
                <ul className="tech-list" aria-label="Tecnologías">
                  {caso.stack.map((tech) => (
                    <li key={tech} className="tech-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div className="caso-story">
          <div className="card caso-story-card">
            <span className="caso-ps-label">
              <b>01</b> El problema
            </span>
            <p>{caso.problema}</p>
          </div>
          <div className="card caso-story-card">
            <span className="caso-ps-label">
              <b>02</b> La solución
            </span>
            <p>{caso.solucion}</p>
          </div>
        </div>

        <div className="caso-result caso-result-lg">
          <span className="caso-result-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 17l5-5 4 4 7-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 8h5v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <span className="caso-result-label">El resultado</span>
            <p>{caso.resultado}</p>
          </div>
        </div>

        <div className="caso-cta card">
          <div>
            <h2>¿Necesitás algo parecido para tu negocio?</h2>
            <p>Contanos qué querés resolver y te respondemos en menos de 24 hs hábiles, sin compromiso.</p>
          </div>
          <Link to="/#contacto" className="btn btn-primary">
            Quiero un proyecto así
          </Link>
        </div>

        {otros.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <h2 className="caso-otros-title">Otros proyectos</h2>
            <div className="caso-otros">
              {otros.map((c) => (
                <Link key={c.slug} to={`/portafolio/${c.slug}`} className="card elev-sm caso-otro">
                  <div className="caso-shot caso-shot-sm">
                    <BrowserBar url={c.url} />
                    <img
                      src={c.imagenes[0].replace(/\/[^/]+$/, '/thumb.webp')}
                      srcSet={`${c.imagenes[0].replace(/\/[^/]+$/, '/thumb-320.webp')} 320w, ${c.imagenes[0].replace(/\/[^/]+$/, '/thumb.webp')} 640w`}
                      sizes="(max-width: 640px) 92vw, 280px"
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="caso-otro-body">
                    <span className="caso-meta-client">{c.cliente || 'Proyecto del estudio'}</span>
                    <h3>{c.titulo}</h3>
                    <span className="caso-otro-link">
                      Ver caso <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
