import { useEffect, useState } from 'react';

/**
 * Devuelve `true` recién cuando la página terminó de cargar y el navegador
 * quedó libre (requestIdleCallback), con un mínimo de `delay` ms.
 *
 * v19 — rendimiento: las dos escenas 3D del Hero (three.js, ~130 kB gzip +
 * compilar shaders) arrancaban junto con la página y competían con el primer
 * pintado del texto y los botones. Ahora se montan después: el contenido
 * aparece primero y el robot se suma un instante más tarde.
 */
export function useDeferredMount(delay = 300) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer;
    let idle;
    const schedule = () => {
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
        else setReady(true);
      }, delay);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      clearTimeout(timer);
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
    };
  }, [delay]);

  return ready;
}

/**
 * Corre/pausa un loop de requestAnimationFrame según si `el` está en
 * pantalla. Devuelve una función para limpiar. `frame` se llama en cada
 * cuadro mientras el elemento es visible y la pestaña está activa.
 *
 * Antes, los loops de three.js del Hero seguían dibujando a 60 fps aunque el
 * usuario ya hubiera bajado al resto de la página — trabajo de GPU/CPU
 * tirado, que en el celular se notaba como scroll trabado en TODA la página.
 */
export function runWhileVisible(el, frame) {
  let raf = null;
  let onScreen = true;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    frame();
  };
  const start = () => {
    if (raf === null && onScreen && document.visibilityState === 'visible') raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  };
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
    else stop();
  });
  io.observe(el);
  const onVis = () => (document.visibilityState === 'visible' ? start() : stop());
  document.addEventListener('visibilitychange', onVis);
  frame();
  start();
  return () => {
    stop();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
  };
}

/**
 * Devuelve `true` a partir de la primera interacción real del usuario
 * (mover el mouse, scrollear, tocar o una tecla) después de que la página
 * cargó. Para el 3D del Hero en escritorio: el robot sigue al cursor, así que
 * recién tiene sentido "despertarlo" cuando hay un cursor moviéndose; hasta
 * entonces se ve la imagen fija, idéntica a su pose de reposo.
 */
export function useInteractionMount(enabled = true) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) return;
    const events = ['pointermove', 'scroll', 'keydown', 'touchstart', 'wheel'];
    const go = () => setReady(true);
    const arm = () => events.forEach((ev) => window.addEventListener(ev, go, { once: true, passive: true }));
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      window.removeEventListener('load', arm);
      events.forEach((ev) => window.removeEventListener(ev, go));
    };
  }, [enabled, ready]);

  return ready;
}
