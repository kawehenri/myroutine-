import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/Modal';
import './Perfis.css';

export default function Perfis() {
  const [perfis, setPerfis] = useLocalStorage('perfis', []);
  const [perfilAtivo, setPerfilAtivo] = useLocalStorage('perfilAtivo', null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const [newPerfil, setNewPerfil] = useState({
    nome: '',
    cor: '#3B82F6',
    icone: '👤',
    senha: '',
  });
  const [senhaInput, setSenhaInput] = useState('');
  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [perfilParaAcessar, setPerfilParaAcessar] = useState(null);
  const { showToast } = useApp();
  const navigate = useNavigate();

  const icones = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🔬', '👩‍🔬', '🎯', '⭐', '🌟', '💪', '🏃', '🧘', '🎨', '📚'];
  const cores = ['#3B82F6', '#38BDF8', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  const handleAddPerfil = () => {
    if (!newPerfil.nome.trim()) {
      showToast('Digite um nome para o perfil', 'error');
      return;
    }

    const perfil = {
      id: editingPerfil ? editingPerfil.id : Date.now(),
      nome: newPerfil.nome,
      cor: newPerfil.cor,
      icone: newPerfil.icone,
      senha: newPerfil.senha || null, // Senha opcional
      criadoEm: editingPerfil ? editingPerfil.criadoEm : new Date().toISOString(),
    };

    if (editingPerfil) {
      setPerfis(perfis.map((p) => (p.id === editingPerfil.id ? perfil : p)));
      showToast('Perfil atualizado!', 'success');
    } else {
      setPerfis([...perfis, perfil]);
      showToast('Perfil criado!', 'success');
    }

    resetForm();
  };

  const handleDeletePerfil = (perfilId) => {
    if (window.confirm('Tem certeza que deseja excluir este perfil? Todos os dados serão perdidos.')) {
      setPerfis(perfis.filter((p) => p.id !== perfilId));
      
      // Se o perfil excluído era o ativo, limpar
      if (perfilAtivo === perfilId) {
        setPerfilAtivo(null);
      }
      
      showToast('Perfil excluído', 'info');
    }
  };

  const handleSelectPerfil = (perfilId) => {
    const perfil = perfis.find(p => p.id === perfilId);
    if (!perfil) return;

    // Se o perfil tem senha, pedir senha
    if (perfil.senha && perfil.senha.trim() !== '') {
      setPerfilParaAcessar(perfilId);
      setShowSenhaModal(true);
      setSenhaInput('');
      return;
    }

    // Se não tem senha, acessar diretamente
    acessarPerfil(perfilId);
  };

  const acessarPerfil = (perfilId) => {
    const perfil = perfis.find(p => p.id === perfilId);
    if (!perfil) return;

    // Salvar diretamente no localStorage primeiro
    try {
      localStorage.setItem('perfilAtivo', JSON.stringify(perfilId));
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showToast('Erro ao salvar perfil', 'error');
      return;
    }
    
    // Atualizar o estado local
    setPerfilAtivo(perfilId);
    
    showToast(`Bem-vindo, ${perfil.nome}!`, 'success');
    
    // Navegar usando window.location.hash que é mais confiável com HashRouter
    // Aguardar um momento para garantir que o ProtectedRoute detecte a mudança
    setTimeout(() => {
      window.location.hash = '#/';
      // Forçar um pequeno reload se necessário
      if (window.location.hash !== '#/') {
        window.location.reload();
      }
    }, 250);
  };

  const handleVerificarSenha = () => {
    if (!perfilParaAcessar) return;

    const perfil = perfis.find(p => p.id === perfilParaAcessar);
    if (!perfil) return;

    if (senhaInput === perfil.senha) {
      setShowSenhaModal(false);
      setSenhaInput('');
      acessarPerfil(perfilParaAcessar);
      setPerfilParaAcessar(null);
    } else {
      showToast('Senha incorreta!', 'error');
      setSenhaInput('');
    }
  };

  const handleEditPerfil = (perfil) => {
    setNewPerfil({
      nome: perfil.nome,
      cor: perfil.cor,
      icone: perfil.icone,
      senha: perfil.senha || '',
    });
    setEditingPerfil(perfil);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewPerfil({
      nome: '',
      cor: '#3B82F6',
      icone: '👤',
      senha: '',
    });
    setEditingPerfil(null);
    setIsModalOpen(false);
  };

  return (
    <div className="perfis-page">
      <div className="perfis-header">
        <h1>My Routine</h1>
        <p className="perfis-subtitle">Escolha ou crie um perfil para começar</p>
      </div>

      <div className="perfis-grid">
        {perfis.map((perfil) => (
          <div
            key={perfil.id}
            className={`perfil-card ${perfilAtivo === perfil.id ? 'ativo' : ''}`}
            style={{ borderColor: perfil.cor }}
            onClick={() => handleSelectPerfil(perfil.id)}
          >
            <div className="perfil-icon" style={{ background: `${perfil.cor}20`, color: perfil.cor }}>
              {perfil.icone}
            </div>
            <div className="perfil-info">
              <h3 className="perfil-nome">
                {perfil.nome}
                {perfil.senha && perfil.senha.trim() !== '' && (
                  <span className="perfil-lock" title="Perfil protegido por senha">🔒</span>
                )}
              </h3>
              <p className="perfil-status">
                {perfilAtivo === perfil.id ? '● Ativo' : 'Clique para ativar'}
              </p>
            </div>
            <div className="perfil-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn-edit-perfil"
                onClick={() => handleEditPerfil(perfil)}
                title="Editar perfil"
              >
                ✏️
              </button>
              <button
                className="btn-delete-perfil"
                onClick={() => handleDeletePerfil(perfil.id)}
                title="Excluir perfil"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <div className="perfil-card add-perfil" onClick={() => setIsModalOpen(true)}>
          <div className="add-perfil-icon">+</div>
          <div className="add-perfil-text">Criar Novo Perfil</div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingPerfil ? 'Editar Perfil' : 'Novo Perfil'}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Nome do Perfil:</label>
            <input
              type="text"
              value={newPerfil.nome}
              onChange={(e) => setNewPerfil({ ...newPerfil, nome: e.target.value })}
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
                  className={`icone-btn ${newPerfil.icone === icone ? 'active' : ''}`}
                  onClick={() => setNewPerfil({ ...newPerfil, icone })}
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
                  className={`cor-btn ${newPerfil.cor === cor ? 'active' : ''}`}
                  style={{ background: cor }}
                  onClick={() => setNewPerfil({ ...newPerfil, cor })}
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
              value={newPerfil.senha}
              onChange={(e) => setNewPerfil({ ...newPerfil, senha: e.target.value })}
              placeholder="Digite uma senha ou código"
              className="form-input"
              maxLength={20}
            />
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleAddPerfil}>
              {editingPerfil ? 'Salvar Alterações' : 'Criar Perfil'}
            </button>
          </div>
          </div>
        </Modal>

      <Modal
        isOpen={showSenhaModal}
        onClose={() => {
          setShowSenhaModal(false);
          setPerfilParaAcessar(null);
          setSenhaInput('');
        }}
        title="🔒 Acesso Protegido"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Digite a senha/código do perfil:</label>
            <input
              type="password"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              placeholder="Senha ou código"
              className="form-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleVerificarSenha();
                }
              }}
              autoFocus
            />
          </div>
          <div className="form-actions">
            <button 
              className="btn-secondary" 
              onClick={() => {
                setShowSenhaModal(false);
                setPerfilParaAcessar(null);
                setSenhaInput('');
              }}
            >
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleVerificarSenha}>
              Acessar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

