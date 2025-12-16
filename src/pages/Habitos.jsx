import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import { getDateKey, formatDateShort, getDaysSinceProfileCreation } from '../utils/dateHelpers';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Habitos.css';

export default function Habitos() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [habitos, setHabitos] = useLocalStorage('habitos', []);
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const { showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabito, setEditingHabito] = useState(null);
  const [newHabito, setNewHabito] = useState({
    nome: '',
    icone: '⭐',
    cor: '#3B82F6',
  });

  const todayKey = getDateKey();
  const todayData = allData[todayKey] || {};
  const habitosData = todayData.habitos || {};
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const icones = ['⭐', '💧', '🧘', '📖', '🎯', '💪', '🌱', '🎨', '🎵', '🏃', '🧠', '💊', '🌞', '🌙'];
  const cores = ['#667eea', '#66bb6a', '#ffa726', '#ef5350', '#42a5f5', '#ab47bc', '#26a69a', '#ec407a'];

  const handleAddHabito = () => {
    if (!newHabito.nome.trim()) {
      showToast('Digite um nome para o hábito', 'error');
      return;
    }

    const habito = {
      id: editingHabito ? editingHabito.id : Date.now(),
      nome: newHabito.nome,
      icone: newHabito.icone,
      cor: newHabito.cor,
      criadoEm: editingHabito ? editingHabito.criadoEm : new Date().toISOString(),
    };

    if (editingHabito) {
      setHabitos(habitos.map((h) => (h.id === editingHabito.id ? habito : h)));
      showToast('Hábito atualizado!', 'success');
    } else {
      setHabitos([...habitos, habito]);
      showToast('Hábito adicionado!', 'success');
    }

    resetForm();
  };

  const handleDeleteHabito = (habitoId) => {
    setHabitos(habitos.filter((h) => h.id !== habitoId));
    
    // Limpar dados do hábito de todos os dias
    const updatedData = { ...allData };
    Object.keys(updatedData).forEach((dateKey) => {
      if (updatedData[dateKey].habitos) {
        delete updatedData[dateKey].habitos[habitoId];
      }
    });
    setAllData(updatedData);
    
    showToast('Hábito excluído', 'info');
  };

  const handleToggleHabito = (habitoId) => {
    const updatedHabitos = {
      ...habitosData,
      [habitoId]: !habitosData[habitoId],
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        habitos: updatedHabitos,
      },
    });
  };

  const handleEditHabito = (habito) => {
    setNewHabito({
      nome: habito.nome,
      icone: habito.icone,
      cor: habito.cor,
    });
    setEditingHabito(habito);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewHabito({
      nome: '',
      icone: '⭐',
      cor: '#667eea',
    });
    setEditingHabito(null);
    setIsModalOpen(false);
  };

  const calculateHabitoStreak = (habitoId) => {
    let streak = 0;
    let date = new Date();
    
    while (true) {
      const dateKey = getDateKey(date);
      const dayData = allData[dateKey];
      
      if (dayData?.habitos?.[habitoId]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);

  return (
    <div className="habitos-page">
      <div className="page-header">
        <h1>🌱 Hábitos Personalizados</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Novo Hábito
        </button>
      </div>

      {habitos.length === 0 ? (
        <Card title="Crie seus próprios hábitos!" icon="🌱">
          <p className="empty-state">
            Adicione hábitos personalizados que você deseja acompanhar diariamente!
          </p>
        </Card>
      ) : (
        <>
          <Card title="Hábitos de Hoje" icon="📋">
            <div className="habitos-today-list">
              {habitos.map((habito) => {
                const isDone = habitosData[habito.id] || false;
                const streak = calculateHabitoStreak(habito.id);

                return (
                  <div
                    key={habito.id}
                    className={`habito-item ${isDone ? 'completed' : ''}`}
                    style={{ borderLeftColor: habito.cor }}
                  >
                    <label className="habito-checkbox">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => handleToggleHabito(habito.id)}
                      />
                      <span className="habito-icon" style={{ color: habito.cor }}>
                        {habito.icone}
                      </span>
                      <span className="habito-name">{habito.nome}</span>
                    </label>
                    <div className="habito-meta">
                      {streak > 0 && (
                        <span className="habito-streak" title={`${streak} dias seguidos`}>
                          🔥 {streak}
                        </span>
                      )}
                      <button
                        className="btn-icon"
                        onClick={() => handleEditHabito(habito)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDeleteHabito(habito.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Histórico Semanal" icon="📊">
            <div className="habitos-grid">
              {habitos.map((habito) => (
                <div key={habito.id} className="habito-history">
                  <div className="habito-history-header">
                    <span className="habito-icon" style={{ color: habito.cor }}>
                      {habito.icone}
                    </span>
                    <span className="habito-name">{habito.nome}</span>
                  </div>
                  <div className="habito-week">
                    {last7Days.map((dateKey) => {
                      const dayData = allData[dateKey];
                      const isDone = dayData?.habitos?.[habito.id] || false;
                      const isToday = dateKey === todayKey;

                      return (
                        <div
                          key={dateKey}
                          className={`habito-day ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}`}
                          style={{ background: isDone ? habito.cor : '#e0e0e0' }}
                          title={`${formatDateShort(dateKey)} - ${isDone ? 'Feito' : 'Não feito'}`}
                        >
                          {isDone ? '✓' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingHabito ? 'Editar Hábito' : 'Novo Hábito'}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Nome do Hábito:</label>
            <input
              type="text"
              value={newHabito.nome}
              onChange={(e) => setNewHabito({ ...newHabito, nome: e.target.value })}
              placeholder="Ex: Beber 2L de água"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Escolha um Ícone:</label>
            <div className="icone-grid">
              {icones.map((icone) => (
                <button
                  key={icone}
                  className={`icone-btn ${newHabito.icone === icone ? 'active' : ''}`}
                  onClick={() => setNewHabito({ ...newHabito, icone })}
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
                  className={`cor-btn ${newHabito.cor === cor ? 'active' : ''}`}
                  style={{ background: cor }}
                  onClick={() => setNewHabito({ ...newHabito, cor })}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleAddHabito}>
              {editingHabito ? 'Salvar Alterações' : 'Adicionar Hábito'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

