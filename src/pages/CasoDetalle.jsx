import { useReveal, revealStyle } from '../hooks/useReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackEvent } from '../utils/analytics';
import { Link } from '../router';
import Carousel from '../components/Carousel';
import { getCasoBySlug, CASOS } from '../data/casos';

function NotFound() {
  return (
    <section style={{ padding: '160px 40px 140px', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <span className="tag tag-outline" style={{ marginBottom: 'var(--space-6)', display: 'inline-flex' }}>
          404
        </span>
        <h1 style={{ fontSize: 32, margin: '16px 0 12px', letterSpacing: '-0.015em' }}>No encontramos ese caso</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 28px' }}>
          Puede que el link esté roto o el caso ya no exista.
        </p>
        <Link to="/#portafolio" className="btn btn-primary">
          Volver al portafolio
        </Link>
      </div>
    </section>
  );
}

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
    title: caso ? `${caso.titulo} — Casos de Éxito | DS.SoftwareStudio` : undefined,
    description: caso ? caso.resumen : undefined,
    path: `/portafolio/${slug}`,
    robots: caso ? 'index, follow' : 'noindex, follow',
    breadcrumb: caso
      ? [
          { name: 'Inicio', url: 'https://dssoftwarestudio.com.ar/' },
          { name: 'Portafolio', url: 'https://dssoftwarestudio.com.ar/#portafolio' },
          { name: caso.titulo, url: `https://dssoftwarestudio.com.ar/portafolio/${slug}` },
        ]
      : undefined,
  });

  if (!caso) return <NotFound />;

  const otros = CASOS.filter((c) => c.slug !== caso.slug);

  return (
    <section className="section-textured" style={{ padding: '150px 40px 140px' }}>
      <div ref={ref} style={{ maxWidth: 860, margin: '0 auto', ...revealStyle(visible, 0) }}>
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

        <div className="card elev-sm" style={{ padding: 'calc(var(--space-8) * 1.4)', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <span className="card-kicker" style={{ display: 'block', marginBottom: 8 }}>El problema</span>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>{caso.problema}</p>
          </div>
          <div style={{ height: 1, background: 'var(--border-neutral)' }} />
          <div>
            <span className="card-kicker" style={{ display: 'block', marginBottom: 8 }}>La solución</span>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>{caso.solucion}</p>
          </div>
          <div style={{ height: 1, background: 'var(--border-neutral)' }} />
          <div>
            <span className="card-kicker" style={{ display: 'block', marginBottom: 8 }}>El resultado</span>
            <p style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 500, color: 'var(--color-accent-300)', margin: 0 }}>{caso.resultado}</p>
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/#contacto" className="btn btn-primary">
            Quiero un proyecto así
          </Link>
        </div>

        {otros.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <h2 style={{ fontSize: 20, margin: '0 0 20px' }}>Otros casos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {otros.map((c) => (
                <Link key={c.slug} to={`/portafolio/${c.slug}`} className="card elev-sm" style={{ padding: 'var(--space-6)', display: 'block' }}>
                  <h3 className="card-title" style={{ fontSize: 15 }}>{c.titulo}</h3>
                  <span style={{ fontSize: 13, color: 'var(--color-accent-300)', fontWeight: 600 }}>Ver caso →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
