import { useLocalStorage } from '../hooks/useLocalStorage';
import { getDateKey, formatDateShort, getDaysSinceProfileCreation } from '../utils/dateHelpers';
import Card from '../components/Card';
import './Treino.css';

export default function Treino() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const todayKey = getDateKey();
  const todayData = allData[todayKey] || {};
  const treinoData = todayData.treino || { feito: false, duracao: 0 };
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const handleToggleTreino = () => {
    const updatedTreino = {
      ...treinoData,
      feito: !treinoData.feito,
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        treino: updatedTreino,
      },
    });
  };

  const handleDurationChange = (duration) => {
    const updatedTreino = {
      ...treinoData,
      duracao: duration,
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        treino: updatedTreino,
      },
    });
  };

  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);
  const treinoCount = last7Days.filter((dateKey) => {
    const dayData = allData[dateKey];
    return dayData?.treino?.feito;
  }).length;

  return (
    <div className="treino-page">
      <div className="page-header">
        <h1>🏋️ Treino</h1>
      </div>

      <div className="treino-grid">
        <Card title="Treino de Hoje" icon="💪">
          <div className="treino-checkbox-container">
            <label className="treino-checkbox">
              <input
                type="checkbox"
                checked={treinoData.feito}
                onChange={handleToggleTreino}
              />
              <span className="checkbox-label">Treino realizado hoje</span>
            </label>
          </div>

          {treinoData.feito && (
            <div className="treino-duration">
              <label>Duração (minutos):</label>
              <input
                type="number"
                min="0"
                value={treinoData.duracao || 0}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                className="duration-input"
                placeholder="Ex: 45"
              />
            </div>
          )}

          <div className="treino-status">
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className={`status-value ${treinoData.feito ? 'completed' : ''}`}>
                {treinoData.feito ? '✅ Feito' : '❌ Não feito'}
              </span>
            </div>
            {treinoData.feito && treinoData.duracao > 0 && (
              <div className="status-item">
                <span className="status-label">Duração:</span>
                <span className="status-value">{treinoData.duracao} min</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Histórico Semanal" icon="📊">
          <div className="treino-stats">
            <div className="stat-card">
              <div className="stat-number">{treinoCount}</div>
              <div className="stat-label">Treinos esta semana</div>
            </div>
          </div>

          <div className="history-list">
            {last7Days.map((dateKey) => {
              const dayData = allData[dateKey];
              const treino = dayData?.treino;
              const isTodayDate = dateKey === todayKey;

              return (
                <div key={dateKey} className={`history-item ${isTodayDate ? 'today' : ''}`}>
                  <div className="history-date">
                    <span>{formatDateShort(dateKey)}</span>
                    {isTodayDate && <span className="today-badge">Hoje</span>}
                  </div>
                  <div className="history-info">
                    <span className={`history-status ${treino?.feito ? 'completed' : ''}`}>
                      {treino?.feito ? '✅' : '❌'}
                    </span>
                    {treino?.feito && treino?.duracao > 0 && (
                      <span className="history-duration">{treino.duracao} min</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

