import { useRef, useState } from 'react';

/**
 * Wraps a button/link with a radial "spotlight" glow that follows the
 * cursor — same idea as a popular shadcn/Tailwind button demo, ported to
 * plain JS/CSS for this project (no Tailwind/TS here). Keeps our existing
 * .btn / .btn-primary / .btn-secondary classes for the base look and adds
 * just the glow layer on top, so it drops into place without changing how
 * the buttons are styled everywhere else.
 */
export default function SpotlightButton({ as = 'a', href, className = '', glowColor = 'rgba(255,255,255,0.45)', children, ...rest }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  function handleMouseMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const Tag = as === 'button' ? 'button' : 'a';

  return (
    <Tag
      ref={ref}
      href={as === 'a' ? href : undefined}
      className={`spotlight-btn ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onFocus={() => setOpacity(1)}
      onBlur={() => setOpacity(0)}
      {...rest}
    >
      <span
        className="spotlight-glow"
        aria-hidden="true"
        style={{ opacity, background: `radial-gradient(120px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 70%)` }}
      />
      <span className="spotlight-content">{children}</span>
    </Tag>
  );
}
