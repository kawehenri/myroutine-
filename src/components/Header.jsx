import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import Modal from './Modal';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const [perfis, setPerfis] = useLocalStorage('perfis', []);
  const [currentPath, setCurrentPath] = useState('/');
  const [editPerfil, setEditPerfil] = useState({
    nome: '',
    cor: '#3B82F6',
    icone: '👤',
    senha: '',
  });
  const dropdownRef = useRef(null);

  const icones = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🔬', '👩‍🔬', '🎯', '⭐', '🌟', '💪', '🏃', '🧘', '🎨', '📚'];
  const cores = ['#3B82F6', '#38BDF8', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  useEffect(() => {
    // Atualizar path atual quando location mudar
    const updatePath = () => {
      const hash = location.hash.replace('#', '') || location.pathname || '/';
      setCurrentPath(hash);
    };
    updatePath();
    
    // Também escutar mudanças no hash
    const handleHashChange = () => {
      updatePath();
    };
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const isActive = (path) => {
    return currentPath === path;
  };

  const perfilAtual = perfis.find(p => p.id === perfilAtivo);

  const handleEditarPerfil = () => {
    if (perfilAtual) {
      setEditPerfil({
        nome: perfilAtual.nome,
        cor: perfilAtual.cor,
        icone: perfilAtual.icone,
        senha: perfilAtual.senha || '',
      });
      setIsEditModalOpen(true);
      setIsProfileDropdownOpen(false);
    }
  };

  const handleSalvarEdicao = () => {
    if (!editPerfil.nome.trim()) {
      showToast('Digite um nome para o perfil', 'error');
      return;
    }

    const perfilAtualizado = {
      ...perfilAtual,
      nome: editPerfil.nome,
      cor: editPerfil.cor,
      icone: editPerfil.icone,
      senha: editPerfil.senha || null,
    };

    setPerfis(perfis.map((p) => (p.id === perfilAtivo ? perfilAtualizado : p)));
    showToast('Perfil atualizado com sucesso!', 'success');
    setIsEditModalOpen(false);
    setEditPerfil({
      nome: '',
      cor: '#3B82F6',
      icone: '👤',
      senha: '',
    });
  };

  const handleSair = () => {
    setIsConfirmExitOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const confirmarSair = () => {
    localStorage.removeItem('perfilAtivo');
    showToast('Você saiu do perfil', 'info');
    setIsConfirmExitOpen(false);
    navigate('/perfis');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img 
            src="/myroutine_logo.png" 
            alt="My Routine" 
            className="logo-icon"
            onError={(e) => {
              console.error('Erro ao carregar logo');
              e.target.style.display = 'none';
            }}
          />
          <span className="logo-text">My Routine</span>
        </Link>
        {perfilAtual && (
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <button 
              className="btn-profile" 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Opções do perfil"
            >
              <span className="profile-icon">{perfilAtual.icone}</span>
              <span className="profile-name">{perfilAtual.nome}</span>
              <span className="dropdown-arrow">{isProfileDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={handleEditarPerfil}>
                  ✏️ Editar
                </button>
                <button className="dropdown-item" onClick={handleSair}>
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        )}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/cronograma" className={isActive('/cronograma') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Cronograma
          </Link>
          <Link to="/estudos" className={isActive('/estudos') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Estudos
          </Link>
          <Link to="/treino" className={isActive('/treino') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Treino
          </Link>
          <Link to="/sono" className={isActive('/sono') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Sono
          </Link>
          <Link to="/alimentacao" className={isActive('/alimentacao') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Alimentação
          </Link>
          <Link to="/habitos" className={isActive('/habitos') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Hábitos
          </Link>
          <Link to="/metas" className={isActive('/metas') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Metas
          </Link>
          <Link to="/calendario" className={isActive('/calendario') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Calendário
          </Link>
          <Link to="/configuracoes" className={isActive('/configuracoes') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            Configurações
          </Link>
        </nav>
      </div>

      {/* Modal de Edição de Perfil */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="✏️ Editar Perfil"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Nome do Perfil:</label>
            <input
              type="text"
              value={editPerfil.nome}
              onChange={(e) => setEditPerfil({ ...editPerfil, nome: e.target.value })}
              placeholder="Ex: João, Trabalho, Pessoal..."
              className="form-input"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Escolha um Ícone:</label>
            <div className="icone-grid">
              {icones.map((icone) => (
                <button
                  key={icone}
                  className={`icone-btn ${editPerfil.icone === icone ? 'active' : ''}`}
                  onClick={() => setEditPerfil({ ...editPerfil, icone })}
                >
                  {icone}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Escolha uma Cor:</label>
            <div className="cor-grid">
              {cores.map((cor) => (
                <button
                  key={cor}
                  className={`cor-btn ${editPerfil.cor === cor ? 'active' : ''}`}
                  style={{ background: cor }}
                  onClick={() => setEditPerfil({ ...editPerfil, cor })}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              Senha/Código (Opcional):
              <span className="form-hint">Deixe em branco para acesso sem senha</span>
            </label>
            <input
              type="password"
              value={editPerfil.senha}
              onChange={(e) => setEditPerfil({ ...editPerfil, senha: e.target.value })}
              placeholder="Digite uma senha ou código"
              className="form-input"
              maxLength={20}
            />
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSalvarEdicao}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação de Saída */}
      <Modal
        isOpen={isConfirmExitOpen}
        onClose={() => setIsConfirmExitOpen(false)}
        title="🚪 Sair do Perfil"
      >
        <div className="confirm-exit-modal">
          <div className="confirm-exit-icon">
            {perfilAtual?.icone}
          </div>
          <div className="confirm-exit-content">
            <h3 className="confirm-exit-title">Deseja sair do perfil "{perfilAtual?.nome}"?</h3>
            <p className="confirm-exit-message">
              Você será redirecionado para a página de seleção de perfis. 
              Seus dados continuarão salvos e você poderá acessar este perfil novamente.
            </p>
          </div>
          <div className="confirm-exit-actions">
            <button 
              className="btn-secondary" 
              onClick={() => setIsConfirmExitOpen(false)}
            >
              Cancelar
            </button>
            <button 
              className="btn-primary btn-exit" 
              onClick={confirmarSair}
            >
              Sair do Perfil
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
}

