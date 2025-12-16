import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getDateKey, formatDateShort, getLastDays, getDaysSinceProfileCreation } from '../utils/dateHelpers';
import { calculateStudyTime } from '../utils/calculations';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Estudos.css';

export default function Estudos() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ nome: '', tempoPlanejado: 30 });
  const todayKey = getDateKey();
  const todayData = allData[todayKey] || {};
  const estudoData = todayData.estudo || { atividades: [], concluido: false, tempoEstudado: 0 };
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const handleAddActivity = () => {
    if (!newActivity.nome.trim()) return;

    const updatedActivities = [
      ...estudoData.atividades,
      {
        id: Date.now(),
        nome: newActivity.nome,
        tempoPlanejado: newActivity.tempoPlanejado,
        concluida: false,
      },
    ];

    const updatedEstudo = {
      ...estudoData,
      atividades: updatedActivities,
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        estudo: updatedEstudo,
      },
    });

    setNewActivity({ nome: '', tempoPlanejado: 30 });
    setIsModalOpen(false);
  };

  const handleToggleActivity = (activityId) => {
    const updatedActivities = estudoData.atividades.map((activity) =>
      activity.id === activityId
        ? { ...activity, concluida: !activity.concluida }
        : activity
    );

    const allCompleted = updatedActivities.every((a) => a.concluida);
    const tempoEstudado = updatedActivities
      .filter((a) => a.concluida)
      .reduce((sum, a) => sum + (a.tempoPlanejado || 0), 0);

    const updatedEstudo = {
      ...estudoData,
      atividades: updatedActivities,
      concluido: allCompleted && updatedActivities.length > 0,
      tempoEstudado,
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        estudo: updatedEstudo,
      },
    });
  };

  const handleDeleteActivity = (activityId) => {
    const updatedActivities = estudoData.atividades.filter((a) => a.id !== activityId);
    const allCompleted = updatedActivities.length > 0 && updatedActivities.every((a) => a.concluida);
    const tempoEstudado = updatedActivities
      .filter((a) => a.concluida)
      .reduce((sum, a) => sum + (a.tempoPlanejado || 0), 0);

    const updatedEstudo = {
      ...estudoData,
      atividades: updatedActivities,
      concluido: allCompleted,
      tempoEstudado,
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        estudo: updatedEstudo,
      },
    });
  };

  const totalTime = calculateStudyTime(todayData);
  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);

  return (
    <div className="estudos-page">
      <div className="page-header">
        <h1>📚 Estudos</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Nova Atividade
        </button>
      </div>

      <div className="estudos-grid">
        <Card title="Atividades de Hoje" icon="📝">
          <div className="time-summary">
            <div className="time-item">
              <span className="time-label">Tempo Estudado:</span>
              <span className="time-value">{totalTime} min</span>
            </div>
            <div className="time-item">
              <span className="time-label">Status:</span>
              <span className={`time-value ${estudoData.concluido ? 'completed' : ''}`}>
                {estudoData.concluido ? '✅ Concluído' : '⏳ Em andamento'}
              </span>
            </div>
          </div>

          {estudoData.atividades.length === 0 ? (
            <p className="empty-state">Nenhuma atividade cadastrada ainda.</p>
          ) : (
            <div className="activities-list">
              {estudoData.atividades.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.concluida ? 'completed' : ''}`}>
                  <label className="activity-checkbox">
                    <input
                      type="checkbox"
                      checked={activity.concluida}
                      onChange={() => handleToggleActivity(activity.id)}
                    />
                    <span className="activity-name">{activity.nome}</span>
                  </label>
                  <div className="activity-meta">
                    <span className="activity-time">{activity.tempoPlanejado} min</span>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Histórico Semanal" icon="📊">
          <div className="history-list">
            {last7Days.map((dateKey) => {
              const dayData = allData[dateKey];
              const estudo = dayData?.estudo;
              const time = calculateStudyTime(dayData);
              const isTodayDate = dateKey === todayKey;

              return (
                <div key={dateKey} className={`history-item ${isTodayDate ? 'today' : ''}`}>
                  <div className="history-date">
                    <span>{formatDateShort(dateKey)}</span>
                    {isTodayDate && <span className="today-badge">Hoje</span>}
                  </div>
                  <div className="history-info">
                    <span className={`history-status ${estudo?.concluido ? 'completed' : ''}`}>
                      {estudo?.concluido ? '✅' : '❌'}
                    </span>
                    <span className="history-time">{time} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Atividade de Estudo"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Nome da Atividade:</label>
            <input
              type="text"
              value={newActivity.nome}
              onChange={(e) => setNewActivity({ ...newActivity, nome: e.target.value })}
              placeholder="Ex: Revisar capítulo 5"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Tempo Planejado (minutos):</label>
            <input
              type="number"
              min="1"
              value={newActivity.tempoPlanejado}
              onChange={(e) => setNewActivity({ ...newActivity, tempoPlanejado: Number(e.target.value) })}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleAddActivity}>
              Adicionar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

