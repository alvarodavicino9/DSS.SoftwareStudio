import { useEffect, useRef, useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTypewriter } from '../hooks/useTypewriter';

const COMMANDS = {
  stack: { response: 'Tecnologías: Python, Django, React, JavaScript, C#, SQL Server, SQLite, REST APIs.' },
  equipo: { response: 'Fundadores: Álvaro Davicino & Gabriel Schurrer (Estudiantes avanzados de Ingenieria).' },
  portafolio: {
    response: 'Mostrando los casos que resolvimos — bajá para verlos, o hacé clic en cualquiera para el detalle completo.',
    scrollTo: 'portafolio',
  },
  tarifas: {
    response: 'Cada proyecto es distinto. Contanos tu idea (comando contacto, o el formulario de abajo) y te armamos un presupuesto a medida.',
  },
  contacto: {
    response: 'Email: dss.softwarestudio@gmail.com | Web: DSSoftwareStudio.com.ar | Tel: +54 3491687912',
    scrollTo: 'contacto',
  },
};

const ALL_COMMANDS = [...Object.keys(COMMANDS), 'help', 'clear'];
const BUTTONS = ['help', 'stack', 'equipo', 'portafolio', 'tarifas', 'contacto', 'clear'];

function helpText() {
  return `Comandos disponibles: ${ALL_COMMANDS.filter((c) => c !== 'help').join(', ')}`;
}

/** Types out `text` once (on mount) unless prefers-reduced-motion is set, in
 *  which case it renders instantly. Only used for the most recent line so
 *  older lines don't replay when a new command is run. */
function TypedResponse({ text, reducedMotion }) {
  const { displayed, done } = useTypewriter(text, 12, 0);
  if (reducedMotion) return <>{text}</>;
  return (
    <>
      {displayed}
      {!done && <span className="typewriter-cursor" aria-hidden="true" />}
    </>
  );
}

export default function Terminal() {
  const [ref, visible] = useReveal();
  const reducedMotion = useReducedMotion();
  const [lines, setLines] = useState([
    { isWelcome: true, text: 'Bienvenido a DS.SoftwareStudio. Escribí help para ver los comandos, o probá los botones de abajo:' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyPos, setHistoryPos] = useState(null); // null = not browsing history
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  function runCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => (prev[prev.length - 1] === cmd ? prev : [...prev, cmd]));
    setHistoryPos(null);

    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    const entry = cmd === 'help' ? { response: helpText() } : COMMANDS[cmd];
    const response = entry ? entry.response : `Comando no reconocido: "${cmd}". Escribí help para ver las opciones.`;
    idRef.current += 1;
    setLines((prev) => [...prev, { id: idRef.current, isCommand: true, cmd, response }]);

    if (entry?.scrollTo) {
      requestAnimationFrame(() => {
        document.getElementById(entry.scrollTo)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runCommand(inputValue);
    setInputValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      if (cmdHistory.length === 0) return;
      e.preventDefault();
      const nextPos = historyPos === null ? cmdHistory.length - 1 : Math.max(0, historyPos - 1);
      setHistoryPos(nextPos);
      setInputValue(cmdHistory[nextPos]);
    } else if (e.key === 'ArrowDown') {
      if (historyPos === null) return;
      e.preventDefault();
      const nextPos = historyPos + 1;
      if (nextPos >= cmdHistory.length) {
        setHistoryPos(null);
        setInputValue('');
      } else {
        setHistoryPos(nextPos);
        setInputValue(cmdHistory[nextPos]);
      }
    } else if (e.key === 'Tab') {
      const val = inputValue.trim().toLowerCase();
      if (!val) return;
      const match = ALL_COMMANDS.find((c) => c.startsWith(val));
      if (match) {
        e.preventDefault();
        setInputValue(match);
      }
    }
  }

  const lastIndex = lines.length - 1;

  return (
    <section id="terminal" style={{ padding: '60px 40px 140px', maxWidth: 900, margin: '0 auto', perspective: 1200 }}>
      <div ref={ref} style={revealStyle(visible, 0)}>
        <h2 style={{ fontSize: 30, margin: '0 0 28px', letterSpacing: '-0.015em' }}>Terminal Interactiva</h2>
        <div
          style={{ background: 'var(--color-terminal-bg)', borderRadius: 8, boxShadow: '0 0 0 1px var(--color-neutral-700)', overflow: 'hidden', fontFamily: "'Courier New', monospace" }}
          onClick={(e) => {
            // Clicking anywhere in the terminal body focuses the input, like a real one.
            if (e.target === e.currentTarget || e.target.closest('[data-terminal-body]')) inputRef.current?.focus();
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(233,233,237,0.1)' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#595d6c' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#595d6c' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-accent)' }} />
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)' }}>ds-studio-cli v1.0.0</span>
          </div>

          <div ref={bodyRef} data-terminal-body style={{ padding: 20, minHeight: 220, maxHeight: 280, overflowY: 'auto', fontSize: 13.5, cursor: 'text' }}>
            {lines.map((line, i) => (
              <div key={line.id ?? 'welcome'} style={{ marginBottom: 10 }}>
                {line.isCommand && (
                  <>
                    <div>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>ds.studio$ </span>
                      <span style={{ color: 'var(--color-text)' }}>{line.cmd}</span>
                    </div>
                    <div style={{ color: 'rgba(233,233,237,0.6)', marginLeft: 16, marginTop: 4 }}>
                      {i === lastIndex ? <TypedResponse text={line.response} reducedMotion={reducedMotion} /> : line.response}
                    </div>
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
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="escribí un comando... (↑ historial, Tab autocompleta)"
              aria-label="Comando de terminal"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
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
