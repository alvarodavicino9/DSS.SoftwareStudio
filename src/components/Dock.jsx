import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { Children, cloneElement, createContext, useContext, useEffect, useRef, useState } from 'react';

// Same magnification-dock behavior as the popular shadcn/Tailwind "Dock"
// component, ported to plain JS/JSX for this project (no TypeScript, no
// Tailwind, no shadcn setup here — see the note in Nav.jsx for why). Visual
// styling comes from layout.css (.nav-dock / .dock-item / .dock-icon /
// .dock-label) instead of Tailwind utility classes.

const DEFAULT_MAGNIFICATION = 52;
const DEFAULT_DISTANCE = 100;
const DEFAULT_BASE_SIZE = 34;
const DEFAULT_PANEL_HEIGHT = 40;

const DockContext = createContext(undefined);

function useDock() {
  const context = useContext(DockContext);
  if (!context) throw new Error('useDock must be used within a Dock');
  return context;
}

export function Dock({
  children,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  baseSize = DEFAULT_BASE_SIZE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={({ pageX }) => mouseX.set(pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`nav-dock ${className}`.trim()}
      style={{ height: panelHeight }}
      role="toolbar"
      aria-label="Navegación principal"
    >
      <DockContext.Provider value={{ mouseX, spring, distance, magnification, baseSize }}>
        {children}
      </DockContext.Provider>
    </motion.div>
  );
}

export function DockItem({ children, className = '', href, ariaLabel, onClick }) {
  const ref = useRef(null);
  const { distance, magnification, mouseX, spring, baseSize } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const sizeTransform = useTransform(mouseDistance, [-distance, 0, distance], [baseSize, magnification, baseSize]);
  const size = useSpring(sizeTransform, spring);

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={`dock-item ${className}`.trim()}
      tabIndex={0}
    >
      {Children.map(children, (child) => cloneElement(child, { size, isHovered }))}
    </motion.a>
  );
}

export function DockLabel({ children, className = '', isHovered }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => setIsVisible(latest === 1));
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`.trim()}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({ children, className = '', size }) {
  const iconSize = useTransform(size, (val) => val / 2);
  return (
    <motion.div style={{ width: iconSize, height: iconSize }} className={`dock-icon ${className}`.trim()}>
      {children}
    </motion.div>
  );
}
