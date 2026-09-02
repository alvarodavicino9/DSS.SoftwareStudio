import Logo from './Logo';
import { Dock, DockItem, DockLabel, DockIcon } from './Dock';
import RadialMenu from './RadialMenu';
import { HomeIcon, WrenchIcon, StepsIcon, BriefcaseIcon, MailIcon } from './NavIcons';
import { useLocation } from '../router';
import { sectionHref } from '../utils/sectionHref';

// Orden alineado con el orden real de las secciones en Home.jsx (Hero →
// Portafolio → Terminal → Servicios → Proceso → Contacto; Terminal no tiene
// link propio acá). Portafolio pasó a ser la segunda sección de la página,
// así que también tiene que ser el segundo link del menú — si no, el menú
// no refleja el orden real de scroll y confunde.
const LINKS = [
  { hash: '#', label: 'Inicio', Icon: HomeIcon },
  { hash: '#portafolio', label: 'Portafolio', Icon: BriefcaseIcon },
  { hash: '#servicios', label: 'Servicios', Icon: WrenchIcon },
  { hash: '#proceso', label: 'Cómo Trabajamos', Icon: StepsIcon },
  { hash: '#contacto', label: 'Contacto', Icon: MailIcon },
];

// Desktop: full logo lockup + icon dock. Mobile: compact mark-only logo
// (the full lockup doesn't fit next to the radial menu trigger without
// overlapping it) + the radial "sections" menu in RadialMenu.jsx.
export default function Nav() {
  const path = useLocation();
  const homeHref = path === '/' ? '#' : '/';

  return (
    <nav
      className="site-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: 'var(--space-6) var(--space-8)',
      }}
    >
      <div style={{ justifySelf: 'start' }}>
        <a href={homeHref} aria-label="DS.SoftwareStudio — inicio" className="nav-logo-full">
          <Logo height={38} light />
        </a>
        <a href={homeHref} aria-label="DS.SoftwareStudio — inicio" className="nav-logo-compact">
          <Logo variant="mark" height={30} light />
        </a>
      </div>

      <div className="nav-links-desktop" style={{ justifySelf: 'center' }}>
        <Dock>
          {LINKS.map((l) => (
            <DockItem key={l.hash} href={sectionHref(l.hash, path)} ariaLabel={l.label}>
              <DockIcon><l.Icon /></DockIcon>
              <DockLabel>{l.label}</DockLabel>
            </DockItem>
          ))}
        </Dock>
      </div>

      <div className="nav-slot-end" style={{ justifySelf: 'end' }}>
        <RadialMenu />
      </div>
    </nav>
  );
}
