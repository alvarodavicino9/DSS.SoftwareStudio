import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import TechBackground from './components/TechBackground';
import Home from './pages/Home';
import CasoDetalle from './pages/CasoDetalle';
import NoEncontrada from './pages/NoEncontrada';
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

export default function App() {
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
