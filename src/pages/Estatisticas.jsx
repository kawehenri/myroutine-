import { useLocalStorage } from '../hooks/useLocalStorage';
import { getLastDays, formatDateShort } from '../utils/dateHelpers';
import { calculateStudyTime, calculateTotalFocusTime } from '../utils/calculations';
import { calculateStreak, calculateBestStreak } from '../utils/streakHelpers';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import './Estatisticas.css';

export default function Estatisticas() {
  const [allData] = useLocalStorage('routineData', {});

  const last30Days = getLastDays(30);
  const last7Days = getLastDays(7);

  // Estatísticas de Estudo
  const totalEstudo30 = last30Days.reduce((sum, date) => {
    return sum + calculateStudyTime(allData[date]);
  }, 0);

  const totalEstudo7 = last7Days.reduce((sum, date) => {
    return sum + calculateStudyTime(allData[date]);
  }, 0);

  const mediaEstudo = Math.round(totalEstudo30 / 30);

  // Estatísticas de Treino
  const diasTreino30 = last30Days.filter((date) => allData[date]?.treino?.feito).length;
  const diasTreino7 = last7Days.filter((date) => allData[date]?.treino?.feito).length;
  const percentualTreino = Math.round((diasTreino30 / 30) * 100);

  // Estatísticas de Sono
  let totalSono = 0;
  let diasComSono = 0;
  last30Days.forEach((date) => {
    const sono = allData[date]?.sono?.horas;
    if (sono) {
      totalSono += sono;
      diasComSono++;
    }
  });
  const mediaSono = diasComSono > 0 ? (totalSono / diasComSono).toFixed(1) : 0;

  // Estatísticas de Foco
  const totalFoco30 = last30Days.reduce((sum, date) => {
    return sum + calculateTotalFocusTime(allData[date]);
  }, 0);
  const mediaFoco = Math.round(totalFoco30 / 30);

  // Streaks
  const estudoStreak = calculateStreak(allData, 'estudo');
  const treinoStreak = calculateStreak(allData, 'treino');
  const sonoStreak = calculateStreak(allData, 'sono');
  
  const estudoBestStreak = calculateBestStreak(allData, 'estudo');
  const treinoBestStreak = calculateBestStreak(allData, 'treino');
  const sonoBestStreak = calculateBestStreak(allData, 'sono');

  // Dados para gráficos
  const estudoWeekData = last7Days.map((date) => ({
    date,
    value: calculateStudyTime(allData[date]),
  }));

  const sonoWeekData = last7Days.map((date) => ({
    date,
    value: allData[date]?.sono?.horas || 0,
  }));

  const maxEstudo = Math.max(...estudoWeekData.map((d) => d.value), 1);
  const maxSono = Math.max(...sonoWeekData.map((d) => d.value), 8);

  return (
    <div className="estatisticas-page">
      <div className="page-header">
        <h1>📊 Estatísticas e Relatórios</h1>
      </div>

      <div className="stats-grid">
        <Card title="Resumo Geral" icon="📈" className="stats-summary">
          <div className="summary-items">
            <div className="summary-item">
              <div className="summary-icon">📚</div>
              <div className="summary-content">
                <div className="summary-label">Tempo de Estudo (30 dias)</div>
                <div className="summary-value">{Math.round(totalEstudo30 / 60)}h {totalEstudo30 % 60}min</div>
                <div className="summary-secondary">Média: {mediaEstudo} min/dia</div>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon">🏋️</div>
              <div className="summary-content">
                <div className="summary-label">Treinos (30 dias)</div>
                <div className="summary-value">{diasTreino30} dias</div>
                <div className="summary-secondary">{percentualTreino}% dos dias</div>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon">😴</div>
              <div className="summary-content">
                <div className="summary-label">Sono Médio</div>
                <div className="summary-value">{mediaSono}h</div>
                <div className="summary-secondary">{diasComSono} dias registrados</div>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon">⏱️</div>
              <div className="summary-content">
                <div className="summary-label">Tempo Focado (30 dias)</div>
                <div className="summary-value">{Math.round(totalFoco30 / 60)}h {totalFoco30 % 60}min</div>
                <div className="summary-secondary">Média: {mediaFoco} min/dia</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Sequências (Streaks)" icon="🔥">
          <div className="streaks-grid">
            <div className="streak-item">
              <div className="streak-header">
                <span className="streak-icon">📚</span>
                <span className="streak-label">Estudo</span>
              </div>
              <div className="streak-value">{estudoStreak} dias</div>
              <div className="streak-best">Melhor: {estudoBestStreak} dias</div>
              {estudoStreak > 0 && (
                <div className="streak-fire">🔥 {estudoStreak >= 7 ? 'Incrível!' : 'Continue!'}</div>
              )}
            </div>

            <div className="streak-item">
              <div className="streak-header">
                <span className="streak-icon">🏋️</span>
                <span className="streak-label">Treino</span>
              </div>
              <div className="streak-value">{treinoStreak} dias</div>
              <div className="streak-best">Melhor: {treinoBestStreak} dias</div>
              {treinoStreak > 0 && (
                <div className="streak-fire">🔥 {treinoStreak >= 7 ? 'Imparável!' : 'Ótimo!'}</div>
              )}
            </div>

            <div className="streak-item">
              <div className="streak-header">
                <span className="streak-icon">😴</span>
                <span className="streak-label">Sono (6h+)</span>
              </div>
              <div className="streak-value">{sonoStreak} dias</div>
              <div className="streak-best">Melhor: {sonoBestStreak} dias</div>
              {sonoStreak > 0 && (
                <div className="streak-fire">🔥 {sonoStreak >= 7 ? 'Excelente!' : 'Siga em frente!'}</div>
              )}
            </div>
          </div>
        </Card>

        <Card title="Tempo de Estudo - Últimos 7 Dias" icon="📚" className="chart-card">
          <div className="chart">
            {estudoWeekData.map((data) => (
              <div key={data.date} className="chart-bar-container">
                <div className="chart-bar-label">{formatDateShort(data.date)}</div>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(data.value / maxEstudo) * 100}%`,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {data.value > 0 && <span className="chart-bar-value">{data.value}min</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Horas de Sono - Últimos 7 Dias" icon="😴" className="chart-card">
          <div className="chart">
            {sonoWeekData.map((data) => (
              <div key={data.date} className="chart-bar-container">
                <div className="chart-bar-label">{formatDateShort(data.date)}</div>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(data.value / maxSono) * 100}%`,
                      background: 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)',
                    }}
                  >
                    {data.value > 0 && <span className="chart-bar-value">{data.value}h</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Comparativo Semanal vs Mensal" icon="📉">
          <div className="comparative-grid">
            <div className="comparative-item">
              <div className="comparative-label">📚 Tempo de Estudo</div>
              <ProgressBar
                value={totalEstudo7}
                max={totalEstudo30 / 4.28}
                label={`7 dias: ${totalEstudo7} min | 30 dias: ${totalEstudo30} min`}
                showPercentage={false}
              />
            </div>

            <div className="comparative-item">
              <div className="comparative-label">🏋️ Dias de Treino</div>
              <ProgressBar
                value={diasTreino7}
                max={7}
                label={`7 dias: ${diasTreino7} | 30 dias: ${diasTreino30}`}
                showPercentage={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

