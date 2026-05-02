import { useState, useCallback } from 'react';

/**
 * Generic hook for persisting state in localStorage.
 *
 * Currently used by:
 *  - `useTheme` — persists the user's light/dark/system preference.
 *
 * Kept as a reusable utility for any future feature that needs
 * client-side persistence outside of Firestore.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wrapped in useCallback so setValue is referentially stable —
  // allows useCallback deps in App.tsx to correctly memoize.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}
