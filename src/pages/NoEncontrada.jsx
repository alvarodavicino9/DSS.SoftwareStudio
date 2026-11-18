import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLocation } from '../router';
import NotFound from '../components/NotFound';

// Cualquier ruta que no sea "/" ni "/portafolio/:slug". Antes estas rutas
// mostraban la home entera, y Google podía tomarlas como páginas duplicadas.
export default function NoEncontrada() {
  const path = useLocation();
  useDocumentMeta({ title: 'Página no encontrada | DS.SoftwareStudio', path, robots: 'noindex, follow' });
  return <NotFound />;
}
