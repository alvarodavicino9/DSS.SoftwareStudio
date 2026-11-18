import { useEffect, useId, useRef, useState } from 'react';

/* ── TiltedGridHero ─────────────────────────────────────────────────
 * Adaptado del componente "tilted-grid-hero" de ruixen.ui (21st.dev) al
 * stack de este sitio: JSX + CSS propio, sin TypeScript, Tailwind ni
 * shadcn (no los usamos en ningún otro lado y sumarlos solo para esto
 * agregaba configuración y peso sin necesidad). La geometría es la misma.
 *
 * Una fila de imágenes viaja de derecha a izquierda por el interior de un
 * cilindro: el centro mira de frente, las puntas se curvan hacia uno y se
 * desvanecen. Como una caja CSS no se puede doblar, cada tarjeta se corta
 * en SLICES tiras verticales, cada una girada sus grados alrededor del eje
 * del cilindro; la tarjeta entera (preserve-3d) es la que se mueve, con una
 * sola animación CSS (en el compositor, sin JS por cuadro).
 *
 * Agregado para el portafolio:
 *  - onTileClick(i): las tarjetas se pueden tocar; devuelve el índice de la
 *    imagen que muestra esa tarjeta.
 *  - activeIndex: la tarjeta que muestra esa imagen lleva un borde de marca.
 *  - La cinta se frena mientras el mouse está encima (para poder hacer
 *    click con calma) y queda quieta con "reducir movimiento".
 * ─────────────────────────────────────────────────────────────────── */

const SLICES = 16;
// Cuánto se superpone cada tira con la anterior, como fracción del ancho de
// una tira (ver más abajo). Invisible: la parte superpuesta muestra la misma
// porción de la imagen, casi en el mismo plano.
const OVERLAP = 0.35;
const CAMERA = 1.6;
const MAX_WIDTH = 55;

function arc(bend) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(width, height, tile, aspect, gap, bend) {
  const h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export default function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  activeIndex = null,
  onTileClick,
  tileLabel,
  children,
  className = '',
  style,
  ...props
}) {
  const ref = useRef(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const orbit = `tgh-o-${id}`;
  const tile = `tgh-t-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  const [layout, setLayout] = useState(null);
  const [shown, setShown] = useState({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns && prev.sweep === next.sweep && prev.unit === next.unit ? prev : next
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit } = layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  const u = (n) => `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(MAX_WIDTH / aspectRatio).toFixed(4)}cqw))`;
  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = (deg) => `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused!important}}` +
    // Frenar mientras el mouse está sobre la cinta (solo con mouse, no en táctil).
    `@media(hover:hover){.tgh-band:hover .${tile}{animation-play-state:paused}}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`;
  const clickable = typeof onTileClick === 'function';

  return (
    <div ref={ref} className={`tgh ${className}`} {...props} style={{ position: 'relative', overflow: 'hidden', containerType: 'size', ...style }}>
      <style>{css}</style>

      <div
        className={`tgh-band${clickable ? ' is-clickable' : ''}`}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: clickable ? 'auto' : 'none',
          opacity: layout ? 1 : 0,
          transition: 'opacity 0.5s',
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const index = (shown[t] ?? first) % Math.max(images.length, 1);
          const img = images[index];
          const active = activeIndex !== null && index === activeIndex;
          return (
            <div
              key={t}
              className={`${tile} tgh-tile${active ? ' is-active' : ''}`}
              title={tileLabel ? tileLabel(index) : undefined}
              onClick={clickable ? () => onTileClick(index) : undefined}
              style={{
                position: 'absolute',
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: 'preserve-3d',
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className={`tgh-slice${k === 0 ? ' is-first' : ''}${k === SLICES - 1 ? ' is-last' : ''}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    overflow: 'hidden',
                    // Cada tira (menos la primera) se estira hacia la izquierda y
                    // tapa el pliegue con su vecina. El original las superponía 1 px,
                    // y cuando la tarjeta se agranda cerca del borde ese píxel no
                    // alcanzaba: se abría una raya oscura que titilaba.
                    left: u((aspectRatio - share) / 2 - (k > 0 ? OVERLAP * share : 0)),
                    width: u(share + (k > 0 ? OVERLAP * share : 0)),
                    height: u(1),
                    transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt=""
                      draggable={false}
                      decoding="async"
                      style={{
                        position: 'absolute',
                        top: 0,
                        maxWidth: 'none',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        left: u(-k * share + (k > 0 ? OVERLAP * share : 0)),
                        width: u(aspectRatio),
                        height: u(1),
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}
