import Hero from '../components/Hero';
import Servicios from '../components/Servicios';
import Proceso from '../components/Proceso';
import Portafolio from '../components/Portafolio';
import AppsEstudio from '../components/AppsEstudio';
import Terminal from '../components/Terminal';
import Contacto from '../components/Contacto';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

// Home de una sola página. Orden pensado para quien llega buscando un
// estudio: primero qué hicimos (Portafolio), después qué hacemos y cómo
// (Servicios, Proceso); las apps propias y la terminal quedan como extra
// antes del formulario de contacto.
export default function Home() {
  // Sin argumentos = vuelve al title/description/canonical por default del
  // sitio. Necesario para resetearlos al volver acá desde un caso de
  // portafolio, que los pisa con los suyos (ver CasoDetalle.jsx).
  useDocumentMeta({ path: '/' });

  return (
    <>
      <Hero />
      <Portafolio />
      <Servicios />
      <Proceso />
      <AppsEstudio />
      <Terminal />
      <Contacto />
    </>
  );
}
