import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Router mínimo propio (pushState + popstate), sin dependencias nuevas —
// mismo criterio que Dock.jsx / RadialMenu.jsx / SpotlightButton.jsx en este
// proyecto: portar la idea de una librería popular (acá, react-router) en
// JS plano en vez de sumar un paquete para dos rutas ("/" y
// "/portafolio/:slug"). Evita también tener que correr `npm install` en la
// máquina del cliente para algo tan chico.
//
// Los links de sección (#servicios, #contacto, etc.) en Nav/Footer/RadialMenu
// NO pasan por acá — son <a href="#..."> normales, que el navegador ya sabe
// resolver (scroll suave en la home, o navegación completa + scroll si se
// viene de /portafolio/:slug). Este router solo se usa para las dos
// transiciones "de página" reales: entrar/salir de un caso de portafolio.

const RouterContext = createContext(null);

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to) => {
    const hashIndex = to.indexOf('#');
    const targetPath = hashIndex === -1 ? to : to.slice(0, hashIndex) || '/';
    const hash = hashIndex === -1 ? null : to.slice(hashIndex + 1);

    if (targetPath !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setPath(targetPath);
    } else {
      window.history.pushState({}, '', to);
    }

    if (hash) {
      // Esperamos un frame para que, si cambió de página, el nuevo contenido
      // ya esté montado antes de buscar el elemento a scrollear.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter/useLocation/useNavigate deben usarse dentro de <RouterProvider>');
  return ctx;
}

export function useLocation() {
  return useRouter().path;
}

export function useNavigate() {
  return useRouter().navigate;
}

/** Link interno — navega sin recargar la página. Para anchors de sección
 * (#servicios) seguí usando <a> normal, no esto. */
export function Link({ to, onClick, children, ...rest }) {
  const navigate = useNavigate();

  function handleClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
    if (onClick) onClick(e);
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
