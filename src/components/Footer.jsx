import Logo from './Logo';
import { WHATSAPP_URL } from '../utils/whatsapp';
import { useLocation } from '../router';
import { sectionHref } from '../utils/sectionHref';

const FOOTER_LINKS = [
  { hash: '#servicios', label: 'Servicios' },
  { hash: '#proceso', label: 'Cómo Trabajamos' },
  { hash: '#portafolio', label: 'Portafolio' },
  { hash: '#contacto', label: 'Contacto' },
];

// Footer un poco más oscuro/opaco que el resto de las secciones "glass" —
// antes usaba var(--color-text) como fondo porque en el tema claro ese token
// era navy oscuro; con el tema oscuro ese mismo token pasó a ser casi blanco
// (ver tokens.css v5), así que ahora usa un color fijo propio en vez de
// heredar el token de texto. Sigue dando ese borde inferior "asentado" que
// tenía antes, ahora en línea con el resto del sitio (que ya es oscuro).
export default function Footer() {
  const path = useLocation();

  return (
    <footer style={{ background: 'rgba(4, 5, 10, 0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid var(--border-neutral)' }}>
      <div style={{ padding: '40px 40px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            height: 1,
            marginBottom: 28,
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.14) 48px, rgba(255,255,255,0.14) calc(100% - 48px), transparent)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div style={{ maxWidth: 280 }}>
            <Logo variant="mark" height={28} style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
              Consultoría de software argentina. Diseñamos y programamos directamente, sin capas comerciales
              en el medio.
            </p>
          </div>

          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px' }} aria-label="Enlaces del sitio">
            {FOOTER_LINKS.map((l) => (
              <a key={l.hash} href={sectionHref(l.hash, path)} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-2)', fontWeight: 500 }}>
              WhatsApp
            </a>
            <a href="mailto:dss.softwarestudio@gmail.com" style={{ color: 'var(--color-accent-2)', fontWeight: 500 }}>
              dss.softwarestudio@gmail.com
            </a>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          © {new Date().getFullYear()} DS.SoftwareStudio • Álvaro Davicino &amp; Gabriel Schurrer •
          DSSoftwareStudio.com.ar
        </p>
      </div>
    </footer>
  );
}
