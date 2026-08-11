import { useEffect, useRef, useState } from 'react';

/**
 * Reveals `text` one character at a time, starting after `startDelay` ms and
 * advancing every `speed` ms. Restarts cleanly if `text` changes.
 * Returns { displayed, done }.
 */
export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  // Keep the latest text in a ref so the interval callback (created once
  // per effect run) always reads the value it was set up for.
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let index = 0;
    let intervalId;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(textRef.current.slice(0, index));
        if (index >= textRef.current.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
