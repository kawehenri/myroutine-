import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [config, setConfig] = useLocalStorage('config', {
    firstDayOfWeek: 0, // 0 = Domingo, 1 = Segunda
    defaultSleepGoal: 8,
    notifications: true,
  });
  const [toasts, setToasts] = useState([]);

  // Aplicar tema
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateConfig = (newConfig) => {
    setConfig({ ...config, ...newConfig });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        config,
        updateConfig,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}

