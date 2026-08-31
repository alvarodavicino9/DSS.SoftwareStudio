import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// Carrusel de tarjetas en abanico (adaptado a JSX plano + CSS propio, sin
// TypeScript ni Tailwind — ver README, sección "Portafolio: carrusel en
// abanico"). La lógica de animación con GSAP es la del componente original;
// lo que cambió es: (1) las clases de Tailwind se reemplazaron por clases
// CSS propias (fan-*, definidas en tokens.css) que usan los tokens de color
// del sitio, y (2) se agregó soporte de selección (`selectedIndex` +
// `onSelect`) para que al clickear una tarjeta se muestre la info del caso
// en vez de navegar a un link.

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * Devuelve un multiplicador (0..1] que achica los offsets en Y y las
 * distancias de la animación de entrada cuando el viewport es demasiado
 * bajo para la altura ideal del layout.
 */
function getHeightMultiplier(width) {
  let idealPx;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;
  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards, slot) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const offset = slot - center;
  // Se normaliza contra HALF (el radio del abanico completo de 7 tarjetas),
  // no contra `center`: así, con pocas tarjetas el abanico ocupa menos
  // ancho (quedan más juntas y más grandes) y a medida que se agregan casos
  // el offset se acerca a ±HALF, separándose hasta calzar con el layout fijo
  // de 7 tarjetas de arriba — la transición es continua.
  const distance = totalCards > 1 ? offset / HALF : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(offset),
  };
}

export default function CardFanCarousel({ cards, selectedIndex = null, onSelect }) {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef(null);
  const prevVisible = useRef(new Set());
  const isPausedRef = useRef(false); // hover/foco pausa el autoplay (no lo desactiva)
  const keyboardNavRef = useRef(false); // marca si el próximo cambio de índice vino del teclado
  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const windowSize = Math.min(totalCards, MAX_VISIBLE);
  const [centerIndex, setCenterIndex] = useState(
    selectedIndex !== null && selectedIndex !== undefined ? selectedIndex : needsPagination ? HALF : totalCards >> 1
  );

  // Mapeo circular único: la tarjeta `center` siempre cae en el slot del
  // medio de la ventana visible, y el resto se ubica alrededor (con wrap si
  // hace falta). Esto vale tanto para el caso paginado (más de 7 casos, solo
  // se ven 7 a la vez) como para el caso actual (todas las tarjetas visibles
  // siempre) — en este último, "centrar" simplemente reordena los slots.
  const getVisibleMap = useCallback(
    (center) => {
      const map = new Map();
      const centerSlot = windowSize >> 1;
      for (let slot = 0; slot < windowSize; slot++) {
        const cardIndex = ((center + slot - centerSlot) % totalCards + totalCards) % totalCards;
        map.set(cardIndex, slot);
      }
      return map;
    },
    [totalCards, windowSize]
  );

  // Al seleccionar una tarjeta (click), esa tarjeta pasa a ser el centro del
  // abanico — así el detalle que aparece debajo siempre corresponde a la
  // tarjeta que quedó destacada en el medio.
  useEffect(() => {
    if (selectedIndex === null || selectedIndex === undefined) return;
    setCenterIndex((prev) => (prev === selectedIndex ? prev : selectedIndex));
  }, [selectedIndex]);

  // Mueve la selección un lugar a la izquierda/derecha (circular). Reemplaza
  // al viejo `cycle` (que sólo desplazaba la ventana visible cuando había
  // pagination): ahora las flechas/teclado/autoplay siempre mueven la
  // *selección*, y como selectedIndex ya sincroniza centerIndex, el abanico
  // se reacomoda solo. También sirve como "salto directo" pasándole un
  // índice en vez de una dirección.
  const step = useCallback(
    (directionOrIndex) => {
      if (!totalCards) return;
      const current = selectedIndex !== null && selectedIndex !== undefined ? selectedIndex : centerIndex;
      let next;
      if (directionOrIndex === 'right') next = (current + 1) % totalCards;
      else if (directionOrIndex === 'left') next = (current - 1 + totalCards) % totalCards;
      else next = ((directionOrIndex % totalCards) + totalCards) % totalCards;
      directionRef.current = directionOrIndex === 'left' ? 'left' : 'right';
      if (onSelect) onSelect(next);
      else setCenterIndex(next);
    },
    [totalCards, selectedIndex, centerIndex, onSelect]
  );
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Autoplay liviano: reusa `step`/`onSelect`, así que la animación es la
  // misma que la de un click — no hay trabajo extra. Se frena solo (sin
  // desactivarse para siempre) mientras el mouse o el teclado están sobre el
  // carrusel, mientras la pestaña no está visible, o si el sistema pide
  // menos movimiento (`prefers-reduced-motion`).
  useEffect(() => {
    if (totalCards <= 1) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const AUTOPLAY_MS = 5500;
    let timeoutId;
    const tick = () => {
      timeoutId = setTimeout(() => {
        if (!isPausedRef.current && document.visibilityState === 'visible') {
          stepRef.current('right');
        }
        tick();
      }, AUTOPLAY_MS);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [totalCards]);

  // Si el cambio de selección vino del teclado (flechas), mueve el foco a
  // la tarjeta que quedó en el centro — así se puede seguir navegando con
  // las flechas sin volver a tabular hasta el carrusel.
  useEffect(() => {
    if (!keyboardNavRef.current) return;
    keyboardNavRef.current = false;
    const container = containerRef.current;
    if (!container) return;
    const idx = selectedIndex !== null && selectedIndex !== undefined ? selectedIndex : centerIndex;
    const el = container.querySelectorAll('.fan-card')[idx];
    el?.focus();
  }, [selectedIndex, centerIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;
    const cardElements = Array.from(container.querySelectorAll('.fan-card'));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const config = (slot) => getSlotConfig(windowSize, slot);

    // Corta cualquier tween en curso (por ejemplo, el "push" de hover que
    // pudo haber quedado activo justo antes de un click) para que el
    // reacomodo al nuevo centro arranque de cero y no compita con una
    // animación anterior.
    gsap.killTweensOf(cardElements);

    isAnimating.current = true;
    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);
      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };
        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: 'elastic.out(1.05,.78)', delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === 'right' ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === 'right' ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: 'power2.out', onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: 'power2.out', onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === 'right' ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === 'right' ? -30 : 30, duration: 0.4, ease: 'power2.in', zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Interacciones al pasar el mouse
    const visibleEntries = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot = null;
    let leaveTimer = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);
      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;
        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;
          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));
            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }
            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }
        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: 'elastic.out(1,.75)',
          overwrite: 'auto',
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener('mouseenter', handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener('mouseleave', onMouseLeave);

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener('resize', onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener('mouseenter', handler));
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, windowSize, getVisibleMap]);

  if (!totalCards) return null;

  const activeIndex = selectedIndex !== null && selectedIndex !== undefined ? selectedIndex : centerIndex;

  const chevron = (direction) => (
    <svg className="fan-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );

  function handleKeyDown(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (totalCards <= 1) return;
    e.preventDefault();
    keyboardNavRef.current = true;
    step(e.key === 'ArrowRight' ? 'right' : 'left');
  }

  return (
    <div
      className="fan-carousel-section"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Proyectos del portafolio"
      onKeyDown={handleKeyDown}
    >
      <div className="fan-carousel-outer">
        <div
          ref={containerRef}
          className="fan-layout"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onFocus={() => { isPausedRef.current = true; }}
          onBlur={() => { isPausedRef.current = false; }}
        >
          {cards.map((card, index) => (
            <button
              key={index}
              type="button"
              className={`fan-card${selectedIndex === index ? ' fan-card-selected' : ''}`}
              onClick={() => onSelect && onSelect(index)}
              aria-label={card.alt || `Proyecto ${index + 1}`}
              aria-pressed={selectedIndex === index}
            >
              <div className="fan-card-image">
                <img src={card.imgUrl} loading="lazy" alt={card.alt || `Card ${index}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {totalCards > 1 && (
        <div className="fan-pagination">
          <button className="fan-arrow" onClick={() => step('left')} aria-label="Proyecto anterior">
            {chevron('left')}
          </button>
          <div className="fan-dots">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`fan-dot${i === activeIndex ? ' fan-dot-active' : ''}`}
                onClick={() => step(i)}
                aria-label={`Ir al proyecto ${i + 1}`}
                aria-current={i === activeIndex}
              />
            ))}
          </div>
          <button className="fan-arrow" onClick={() => step('right')} aria-label="Siguiente proyecto">
            {chevron('right')}
          </button>
        </div>
      )}
    </div>
  );
}
