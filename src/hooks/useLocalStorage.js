import { useState, useEffect } from 'react';

/**
 * Hook customizado para gerenciar dados no localStorage
 * @param {string} key - Chave no localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {[any, function]} - [valor, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage para chave "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para chave "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

