import Hero from '../components/Hero';
import Servicios from '../components/Servicios';
import Proceso from '../components/Proceso';
import Portafolio from '../components/Portafolio';
import Terminal from '../components/Terminal';
import Contacto from '../components/Contacto';

// Home de una sola página. La sección "Nosotros" (Nosotros.jsx) se sacó a
// pedido — el componente queda en el repo sin usar, igual que
// TechNetwork/HeroFigure en su momento (ver README v4), por si se reutiliza
// más adelante.
export default function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <Proceso />
      <Portafolio />
      <Terminal />
      <Contacto />
    </>
  );
}
