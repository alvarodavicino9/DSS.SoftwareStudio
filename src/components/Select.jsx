import { useEffect, useRef, useState } from 'react';

/**
 * Custom select — replaces the native <select>, whose dropdown popup is
 * rendered by the OS (Windows/Chrome shows a plain light-gray list with low
 * contrast against our dark theme, no CSS can touch it). This renders the
 * open panel ourselves so it matches the rest of the form.
 *
 * Not a full ARIA combobox (no typeahead) — a button that toggles a
 * role="listbox" panel, which covers keyboard (arrows/enter/escape/tab) and
 * screen readers well enough for a 4-option field like this one.
 */
export default function Select({ id, options, value, onChange, disabled, placeholder = 'Seleccionar opción...', className = '', onBlur }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  function commit(idx) {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleButtonKeyDown(e) {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleListKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="select-root">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={`input select-trigger${open ? ' select-trigger-open' : ''} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        onBlur={(e) => {
          // Skip firing blur-validation while a click is landing inside the
          // panel — otherwise selecting an option also flags it as "empty".
          if (rootRef.current && rootRef.current.contains(e.relatedTarget)) return;
          onBlur?.();
        }}
      >
        <span className={selected ? '' : 'select-placeholder'}>{selected ? selected.label : placeholder}</span>
        <svg className="select-caret" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="select-panel"
          onKeyDown={handleListKeyDown}
          aria-activedescendant={activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={opt.value === value}
              className={`select-option${i === activeIndex ? ' select-option-active' : ''}${opt.value === value ? ' select-option-selected' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(i)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
