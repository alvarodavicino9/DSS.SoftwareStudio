import { Link } from '../router';

// Pantalla 404 compartida (caso de portafolio inexistente y cualquier otra
// ruta desconocida). No llama a useDocumentMeta a propósito: cada página que
// la usa ya fija title/robots (noindex) con su propia llamada, y un efecto
// acá adentro correría antes y quedaría pisado.
export default function NotFound({
  titulo = 'No encontramos esta página',
  texto = 'Puede que el link esté roto o que la página se haya movido.',
}) {
  return (
    <section className="notfound-page">
      <div className="notfound-inner">
        <span className="tag tag-outline notfound-tag">404</span>
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            Ir al inicio
          </Link>
          <Link to="/#portafolio" className="btn btn-secondary">
            Ver proyectos
          </Link>
        </div>
      </div>
    </section>
  );
}
