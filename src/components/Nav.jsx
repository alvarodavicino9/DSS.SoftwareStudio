import Logo from './Logo';
import { Dock, DockItem, DockLabel, DockIcon } from './Dock';
import RadialMenu from './RadialMenu';
import { HomeIcon, UsersIcon, WrenchIcon, StepsIcon, BriefcaseIcon, MailIcon } from './NavIcons';

const LINKS = [
  { href: '#', label: 'Inicio', Icon: HomeIcon },
  { href: '#nosotros', label: 'Nosotros', Icon: UsersIcon },
  { href: '#servicios', label: 'Servicios', Icon: WrenchIcon },
  { href: '#proceso', label: 'Cómo Trabajamos', Icon: StepsIcon },
  { href: '#portafolio', label: 'Portafolio', Icon: BriefcaseIcon },
  { href: '#contacto', label: 'Contacto', Icon: MailIcon },
];

// Desktop: full logo lockup + icon dock. Mobile: compact mark-only logo
// (the full lockup doesn't fit next to the radial menu trigger without
// overlapping it) + the radial "sections" menu in RadialMenu.jsx.
export default function Nav() {
  return (
    <nav
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
        background: 'var(--gradient-brand)',
        boxShadow: '0 4px 24px rgba(20, 21, 31, 0.16)',
      }}
    >
      <div style={{ justifySelf: 'start' }}>
        <a href="#" aria-label="DS.SoftwareStudio — inicio" className="nav-logo-full">
          <Logo height={38} light />
        </a>
        <a href="#" aria-label="DS.SoftwareStudio — inicio" className="nav-logo-compact">
          <Logo variant="mark" height={30} light />
        </a>
      </div>

      <div className="nav-links-desktop" style={{ justifySelf: 'center' }}>
        <Dock>
          {LINKS.map((l) => (
            <DockItem key={l.href} href={l.href} ariaLabel={l.label}>
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
