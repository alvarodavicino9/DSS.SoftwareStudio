import { useEffect, useState } from 'react';
import Logo from './Logo';
import { HomeIcon, UsersIcon, WrenchIcon, StepsIcon, BriefcaseIcon, MailIcon } from './NavIcons';

const LINKS = [
  { href: '#', label: 'Inicio', Icon: HomeIcon },
  { href: '#nosotros', label: 'Nosotros', Icon: UsersIcon },
  { href: '#servicios', label: 'Servicios', Icon: WrenchIcon },
  { href: '#proceso', label: 'Cómo Trabajamos', Icon: StepsIcon },
  { href: '#portafolio', label: 'Portafolio', Icon: BriefcaseIcon },
  { href: '#contacto', label: 'Contacto', Icon: MailIcon },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'grid',
        // Two equal flanking columns keep the links visually centered no
        // matter what's in the right column — on desktop that's nothing
        // (the hamburger is mobile-only, display:none there), so a plain
        // flex + space-between would shove the links off to the right.
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: 'var(--space-6) var(--space-8)',
        background: 'var(--gradient-brand)',
        boxShadow: '0 4px 24px rgba(20, 21, 31, 0.16)',
      }}
    >
      <a href="#" onClick={closeMenu} aria-label="DS.SoftwareStudio — inicio" style={{ justifySelf: 'start' }}>
        <Logo height={38} light />
      </a>

      <div className="nav-links-desktop nav-dock" style={{ justifySelf: 'center' }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="dock-item" aria-label={l.label}>
            <span className="dock-icon"><l.Icon /></span>
            <span className="dock-label" aria-hidden="true">{l.label}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        className="hamburger-btn"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ justifySelf: 'end' }}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <l.Icon />
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
