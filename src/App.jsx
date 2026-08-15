import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import TechBackground from './components/TechBackground';
import Home from './pages/Home';
import CasoDetalle from './pages/CasoDetalle';
import { RouterProvider, useLocation } from './router';

const PORTAFOLIO_ROUTE = /^\/portafolio\/([^/]+)\/?$/;

function Pages() {
  const path = useLocation();
  const match = PORTAFOLIO_ROUTE.exec(path);
  return <main>{match ? <CasoDetalle slug={match[1]} /> : <Home />}</main>;
}

export default function App() {
  return (
    <RouterProvider>
      {/* Fondo animado (canvas 2D, TechBackground.jsx) fijo detrás de toda la
          página. Reemplaza al degradé WebGL abstracto (AnimatedGradient.jsx,
          queda en el repo sin usar) por una red de nodos conectados con
          pulsos de datos viajando por las conexiones — mismo lenguaje visual
          que el Hero (TechNetwork.jsx), pero liviano y sin depender de
          WebGL2, que no está garantizado en toda máquina/navegador. */}
      <TechBackground />
      <Nav />
      <Pages />
      <Footer />
      <FloatingWhatsApp />
    </RouterProvider>
  );
}
