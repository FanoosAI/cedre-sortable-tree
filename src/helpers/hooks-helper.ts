import { useState } from 'react';

export const useLocalStorage = <V>(
  key: string,
  initialValue: V,
): [V, (value: V) => void] => {
  const [storedValue, setStoredValue] = useState<V>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as V) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: V) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
