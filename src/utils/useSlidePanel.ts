import { useState, useCallback, useRef } from 'react';

/**
 * Hook for slide-in/slide-out panel transitions.
 * Returns the visible state (for rendering), animation class, open/close functions.
 */
export function useSlidePanel<T = boolean>() {
  const [value, setValue] = useState<T | null>(null);
  const [visible, setVisible] = useState(false);
  const [animClass, setAnimClass] = useState('animate-slide-in-right');
  const closingRef = useRef(false);

  const open = useCallback((v: T) => {
    closingRef.current = false;
    setValue(v);
    setVisible(true);
    setAnimClass('animate-slide-in-right');
  }, []);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setAnimClass('animate-slide-out-right');
    setTimeout(() => {
      setValue(null);
      setVisible(false);
      setAnimClass('animate-slide-in-right');
      closingRef.current = false;
    }, 150); // matches animation duration
  }, []);

  return { value, visible, animClass, open, close };
}
