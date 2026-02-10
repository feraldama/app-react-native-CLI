import { useEffect, useState } from 'react';

/**
 * Valor debounced: se actualiza solo después de `delay` ms sin cambios.
 * Útil para búsqueda (ej. 300ms).
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
