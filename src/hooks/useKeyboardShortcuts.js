import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleTheme } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + número para navegação
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/');
            break;
          case '2':
            e.preventDefault();
            navigate('/cronograma');
            break;
          case '3':
            e.preventDefault();
            navigate('/estudos');
            break;
          case '4':
            e.preventDefault();
            navigate('/treino');
            break;
          case '5':
            e.preventDefault();
            navigate('/sono');
            break;
          case '6':
            e.preventDefault();
            navigate('/alimentacao');
            break;
          case '7':
            e.preventDefault();
            navigate('/habitos');
            break;
          case '8':
            e.preventDefault();
            navigate('/metas');
            break;
          case '9':
            e.preventDefault();
            navigate('/calendario');
            break;
          case '0':
            e.preventDefault();
            navigate('/configuracoes');
            break;
          default:
            break;
        }
      }

      // Alt + T para alternar tema
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      }

      // Esc para fechar modais (se houver algum aberto)
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach((modal) => {
          const closeBtn = modal.querySelector('.modal-close');
          if (closeBtn) {
            closeBtn.click();
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, toggleTheme]);
}

