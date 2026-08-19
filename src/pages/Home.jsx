import Hero from '../components/Hero';
import Servicios from '../components/Servicios';
import Proceso from '../components/Proceso';
import Portafolio from '../components/Portafolio';
import Terminal from '../components/Terminal';
import Contacto from '../components/Contacto';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

// Home de una sola página. La sección "Nosotros" (Nosotros.jsx) se sacó a
// pedido — el componente queda en el repo sin usar, igual que
// TechNetwork/HeroFigure en su momento (ver README v4), por si se reutiliza
// más adelante.
export default function Home() {
  // Sin argumentos = vuelve al title/description/canonical por default del
  // sitio. Necesario para resetearlos al volver acá desde un caso de
  // portafolio, que los pisa con los suyos (ver CasoDetalle.jsx).
  useDocumentMeta({ path: '/' });

  return (
    <>
      <Hero />
      <Portafolio />
      <Terminal />
      <Servicios />
      <Proceso />
      <Contacto />
    </>
  );
}
