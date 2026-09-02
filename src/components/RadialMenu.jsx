import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, WrenchIcon, StepsIcon, BriefcaseIcon, MailIcon } from './NavIcons';
import { useLocation } from '../router';
import { sectionHref } from '../utils/sectionHref';

// `label` is the full name (used for aria-label / accessibility). `short` is
// what actually renders under the icon — "Cómo Trabajamos" is too wide to
// sit next to its neighbors without crowding them, so it gets a shorter
// on-screen name while keeping the descriptive aria-label intact.
// Mismo orden que LINKS en Nav.jsx, alineado con el orden real de las
// secciones en Home.jsx — Portafolio es la segunda sección de la página,
// así que va segunda acá también (ver el comentario en Nav.jsx).
const ITEMS = [
  { hash: '#', label: 'Inicio', short: 'Inicio', Icon: HomeIcon },
  { hash: '#portafolio', label: 'Portafolio', short: 'Portafolio', Icon: BriefcaseIcon },
  { hash: '#servicios', label: 'Servicios', short: 'Servicios', Icon: WrenchIcon },
  { hash: '#proceso', label: 'Cómo Trabajamos', short: 'Proceso', Icon: StepsIcon },
  { hash: '#contacto', label: 'Contacto', short: 'Contacto', Icon: MailIcon },
];

// Trigger lives top-right in the nav bar. Hand-picked pixel radii kept
// clipping items off the left edge on narrower windows, so instead of
// guessing angles/radius that "should" fit, this measures the trigger's
// actual on-screen position when it opens and works out, from the real
// available space in each direction (left/right/down), exactly how wide an
// arc and radius fit — then spreads the 6 items evenly across THAT. Nothing
// can clip because the numbers come from the real screen, not an assumption.
const EDGE_MARGIN = 16;
const ITEM_HALF = 23; // half of the 46px item circle
// Each item now has a name label hanging below its circle — this reserves
// space for it so the label itself can't get clipped by the bottom edge,
// same "measure real space, don't guess" fix as everything else here.
const LABEL_ALLOWANCE = 26;
// Bumped up from 90 so labels have more room between neighboring items and
// don't crowd/overlap each other.
const MIN_RADIUS = 104;
const MAX_RADIUS = 210;

function computePoints(origin, count) {
  if (!origin) return Array(count).fill({ x: 0, y: 0 });

  const spaceLeft = Math.max(0, origin.cx - EDGE_MARGIN - ITEM_HALF);
  const spaceRight = Math.max(0, window.innerWidth - origin.cx - EDGE_MARGIN - ITEM_HALF);
  const spaceDown = Math.max(0, window.innerHeight - origin.cy - EDGE_MARGIN - ITEM_HALF - LABEL_ALLOWANCE);

  const radius = Math.min(Math.max(MIN_RADIUS, spaceDown), MAX_RADIUS);

  // Widest safe angle toward the left (near 180deg) and toward the right
  // (near 0deg) that still keeps a point at this radius on-screen.
  const startAngle = spaceLeft >= radius ? Math.PI : Math.acos(-spaceLeft / radius);
  const endAngle = spaceRight >= radius ? 0 : Math.acos(spaceRight / radius);

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = startAngle + (endAngle - startAngle) * t;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * Mobile-only floating "sections" menu — press the trigger and every section
 * fans out around it (staggered spring), press a section to jump there
 * (closes the menu), press the trigger again (now an X) to retract everything
 * back to center. Desktop keeps the icon dock in the nav bar; this is a
 * separate, independent control that only renders under 700px (see
 * .radial-menu media query in layout.css).
 */
export default function RadialMenu() {
  const path = useLocation();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setOrigin({ cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 });
    }
    setOpen((o) => !o);
  }

  const points = open ? computePoints(origin, ITEMS.length) : [];

  return (
    <div className="radial-menu">
      <AnimatePresence>
        {open &&
          ITEMS.map((item, i) => {
            const { x, y } = points[i];
            return (
              <motion.a
                key={item.hash}
                href={sectionHref(item.hash, path)}
                aria-label={item.label}
                className="radial-item"
                onClick={() => setOpen(false)}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x, y, opacity: 1, scale: 1 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: i % 2 === 0 ? 50 : -50 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.045 }}
              >
                <item.Icon />
                <span className="radial-item-label" aria-hidden="true">
                  {item.short}
                </span>
              </motion.a>
            );
          })}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        className="radial-trigger"
        aria-label={open ? 'Cerrar menú de secciones' : 'Abrir menú de secciones'}
        aria-expanded={open}
        onClick={handleToggle}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="radial-trigger-icon"
        >
          <PlusIcon />
        </motion.span>
      </button>
    </div>
  );
}
