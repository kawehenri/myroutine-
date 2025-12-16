import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [perfilAtivo, setPerfilAtivo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkPerfil = () => {
    try {
      const stored = localStorage.getItem('perfilAtivo');
      const perfil = stored ? JSON.parse(stored) : null;
      setPerfilAtivo(perfil);
    } catch (error) {
      setPerfilAtivo(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Verificar localStorage diretamente
    checkPerfil();
    
    // Listener para mudanças no localStorage (de outras abas/componentes)
    const handleStorageChange = (e) => {
      if (e.key === 'perfilAtivo') {
        checkPerfil();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Também verificar periodicamente para pegar mudanças na mesma aba
    const interval = setInterval(checkPerfil, 200);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        color: 'var(--text-primary)',
        fontSize: '1.1rem'
      }}>
        Carregando...
      </div>
    );
  }

  if (!perfilAtivo) {
    return <Navigate to="/perfis" replace />;
  }

  return children;
}

