const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

// Barra de navegador de mentira arriba de la captura: la enmarca como "un
// sitio real" y muestra el dominio donde está publicado.
export default function BrowserBar({ url }) {
  return (
    <div className="caso-shot-bar" aria-hidden="true">
      <span />
      <span />
      <span />
      {url && (
        <em>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" />
          </svg>
          {hostOf(url)}
        </em>
      )}
    </div>
  );
}
