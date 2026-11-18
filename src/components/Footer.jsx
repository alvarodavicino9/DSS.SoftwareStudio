import Logo from './Logo';
import { WHATSAPP_URL } from '../utils/whatsapp';
import { INSTAGRAM_URL } from '../utils/instagram';
import { useLocation } from '../router';
import { sectionHref } from '../utils/sectionHref';

// Mismo orden que LINKS en Nav.jsx, alineado con el orden real de las
// secciones en Home.jsx.
const FOOTER_LINKS = [
  { hash: '#portafolio', label: 'Portafolio' },
  { hash: '#servicios', label: 'Servicios' },
  { hash: '#proceso', label: 'Cómo trabajamos' },
  { hash: '#apps', label: 'Apps del Estudio' },
  { hash: '#contacto', label: 'Contacto' },
];

// v19: tres columnas con título (marca, secciones, contacto) en vez de una
// fila suelta de links; links con alto mínimo de 32px para que se puedan
// tocar bien en el celular, y textos con más contraste (el gris de 40% de
// opacidad no llegaba al mínimo de legibilidad).
export default function Footer() {
  const path = useLocation();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Logo variant="mark" height={28} style={{ marginBottom: 14 }} />
            <p>
              Estudio de software argentino. Diseñamos y programamos sitios, tiendas online y sistemas a medida, sin
              intermediarios: hablás directo con quienes escriben el código.
            </p>
            <a href={sectionHref('#contacto', path)} className="btn btn-primary site-footer-cta">
              Contanos tu proyecto
            </a>
          </div>

          <nav aria-label="Secciones del sitio">
            <h2 className="site-footer-title">Secciones</h2>
            <ul>
              {FOOTER_LINKS.map((l) => (
                <li key={l.hash}>
                  <a href={sectionHref(l.hash, path)}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="site-footer-title">Contacto</h2>
            <ul>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </li>
              <li>
                <a href="mailto:dss.softwarestudio@gmail.com" aria-label="Email: dss.softwarestudio@gmail.com">
                  <span className="footer-email-full">dss.softwarestudio@gmail.com</span>
                  <span className="footer-email-short">Email</span>
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="site-footer-legal">
          © {new Date().getFullYear()} DS.SoftwareStudio · Álvaro Davicino &amp; Gabriel Schurrer · Argentina
        </p>
      </div>
    </footer>
  );
}
