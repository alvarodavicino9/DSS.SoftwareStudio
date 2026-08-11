import Nav from './components/Nav';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Hero from './components/Hero';
import Nosotros from './components/Nosotros';
import Servicios from './components/Servicios';
import Proceso from './components/Proceso';
import Portafolio from './components/Portafolio';
import Terminal from './components/Terminal';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 80% 12%, rgba(139,124,246,0.10), transparent 42%), radial-gradient(circle at 8% 88%, rgba(47,200,219,0.08), transparent 45%)',
        }}
      />
      <Nav />
      <main>
        <Hero />
        <Nosotros />
        <Servicios />
        <Proceso />
        <Portafolio />
        <Terminal />
        <Contacto />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
