import { useEffect, useRef, useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';

const RESPONSES = {
  help: 'Comandos disponibles: stack, equipo, contacto, clear',
  stack: 'Tecnologías: Python, Django, React, JavaScript, C#, SQL Server, SQLite, REST APIs.',
  equipo: 'Fundadores: Álvaro Davicino & Gabriel Schurrer (Ingenieros en Software).',
  contacto: 'Email: contacto@dssoftwarestudio.com.ar | Web: DSSoftwareStudio.com.ar',
};

const BUTTONS = ['help', 'stack', 'equipo', 'contacto', 'clear'];

export default function Terminal() {
  const [ref, visible] = useReveal();
  const [lines, setLines] = useState([
    { isWelcome: true, text: 'Bienvenido a DS.SoftwareStudio. Escribí o hacé clic abajo para probar comandos:' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  function runCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    const response = RESPONSES[cmd] || 'Comando no reconocido. Escribí help para ver las opciones.';
    setLines((prev) => [...prev, { isCommand: true, cmd, response }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runCommand(inputValue);
    setInputValue('');
  }

  return (
    <section id="terminal" style={{ padding: '60px 40px 140px', maxWidth: 900, margin: '0 auto', perspective: 1200 }}>
      <div ref={ref} style={revealStyle(visible, 0)}>
        <h2 style={{ fontSize: 30, margin: '0 0 28px', letterSpacing: '-0.015em' }}>Terminal Interactiva</h2>
        <div style={{ background: 'var(--color-terminal-bg)', borderRadius: 8, boxShadow: '0 0 0 1px var(--color-neutral-700)', overflow: 'hidden', fontFamily: "'Courier New', monospace" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(233,233,237,0.1)' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#595d6c' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#595d6c' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-accent)' }} />
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)' }}>ds-studio-cli v1.0.0</span>
          </div>

          <div ref={bodyRef} style={{ padding: 20, minHeight: 220, maxHeight: 280, overflowY: 'auto', fontSize: 13.5 }}>
            {lines.map((line, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {line.isCommand && (
                  <>
                    <div>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>ds.studio$ </span>
                      <span style={{ color: 'var(--color-text)' }}>{line.cmd}</span>
                    </div>
                    <div style={{ color: 'rgba(233,233,237,0.6)', marginLeft: 16, marginTop: 4 }}>{line.response}</div>
                  </>
                )}
                {line.isWelcome && (
                  <div>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>ds.studio$ </span>
                    <span style={{ color: 'rgba(233,233,237,0.6)' }}>{line.text}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, padding: '10px 16px', borderTop: '1px solid rgba(233,233,237,0.1)' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: 13.5, alignSelf: 'center' }}>ds.studio$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="escribí un comando..."
              aria-label="Comando de terminal"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text)',
                fontFamily: 'inherit',
                fontSize: 13.5,
              }}
            />
          </form>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 16px', borderTop: '1px solid rgba(233,233,237,0.1)' }}>
            {BUTTONS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => runCommand(cmd)}
                className="btn btn-secondary"
                style={{ fontFamily: 'monospace', fontSize: 12, padding: 'var(--space-2) var(--space-3)' }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
