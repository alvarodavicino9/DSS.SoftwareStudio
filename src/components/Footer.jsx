import Logo from './Logo';
import { WHATSAPP_URL } from '../utils/whatsapp';

const FOOTER_LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Cómo Trabajamos' },
  { href: '#portafolio', label: 'Portafolio' },
  { href: '#contacto', label: 'Contacto' },
];

// Dark footer on purpose — the page is light end to end (nav aside), and a
// plain white footer right after a light Contacto section just faded into
// nothing. This gives the page a grounded bottom edge and echoes the dark
// Terminal section instead of leaving everything flat.
export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-text)' }}>
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
              <a key={l.href} href={l.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-2)', fontWeight: 500 }}>
              WhatsApp
            </a>
            <a href="mailto:contacto@dssoftwarestudio.com.ar" style={{ color: 'var(--color-accent-2)', fontWeight: 500 }}>
              contacto@dssoftwarestudio.com.ar
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
