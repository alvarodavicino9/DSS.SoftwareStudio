import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AnimatedGradient from './components/AnimatedGradient';
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
      {/* Fondo animado (WebGL, AnimatedGradient.jsx) fijo detrás de toda la
          página — reemplaza los fondos blancos/planos de cada sección. */}
      <AnimatedGradient
        config={{
          preset: 'custom',
          color1: '#06070d',
          color2: '#6d5bd0',
          color3: '#0d3138',
          rotation: -35,
          proportion: 42,
          scale: 0.35,
          speed: 12,
          distortion: 3,
          swirl: 22,
          swirlIterations: 8,
          softness: 100,
          offset: 0,
          shape: 'Edge',
          shapeSize: 55,
        }}
        noise={{ opacity: 5, scale: 1 }}
        style={{ position: 'fixed', inset: 0, zIndex: -2 }}
      />
      <Nav />
      <Pages />
      <Footer />
      <FloatingWhatsApp />
    </RouterProvider>
  );
}
