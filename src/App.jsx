import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import TechBackground from './components/TechBackground';
import Home from './pages/Home';
import CasoDetalle from './pages/CasoDetalle';
import NoEncontrada from './pages/NoEncontrada';
import { useEffect } from 'react';
import { RouterProvider, useLocation } from './router';

const PORTAFOLIO_ROUTE = /^\/portafolio\/([^/]+)\/?$/;
const HOME_ROUTE = /^\/(index\.html)?$/;

function Pages() {
  const path = useLocation();
  const match = PORTAFOLIO_ROUTE.exec(path);
  let page = <NoEncontrada />;
  if (match) page = <CasoDetalle slug={match[1]} />;
  else if (HOME_ROUTE.test(path)) page = <Home />;
  return <main>{page}</main>;
}

// "Inicio" y el logo apuntan a "#": sin esto el navegador deja la dirección
// como dssoftwarestudio.com.ar/#. Acá se sube al principio y se limpia la URL.
function useCleanHomeHash() {
  useEffect(() => {
    if (window.location.pathname === '/' && window.location.href.endsWith('#')) {
      window.history.replaceState(null, '', '/' + window.location.search);
    }
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href="#"]');
      if (!a || window.location.pathname !== '/') return;
      e.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      window.history.replaceState(null, '', '/' + window.location.search);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

export default function App() {
  useCleanHomeHash();
  return (
    <RouterProvider>
      {/* Fondo animado (canvas 2D, TechBackground.jsx) fijo detrás de toda la
          página: red de nodos conectados con pulsos de datos, mismo lenguaje
          visual que el Hero (TechNetwork.jsx), liviano y sin WebGL2. */}
      <TechBackground />
      <Nav />
      <Pages />
      <Footer />
      <FloatingWhatsApp />
    </RouterProvider>
  );
}
