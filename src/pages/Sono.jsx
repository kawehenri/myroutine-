import { useLocalStorage } from '../hooks/useLocalStorage';
import { getDateKey, formatDateShort, getDaysSinceProfileCreation } from '../utils/dateHelpers';
import { calculateAverageSleep } from '../utils/calculations';
import Card from '../components/Card';
import './Sono.css';

export default function Sono() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const todayKey = getDateKey();
  const todayData = allData[todayKey] || {};
  const sonoData = todayData.sono || { horas: 0 };
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const handleHoursChange = (hours) => {
    const updatedSono = {
      horas: hours,
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        sono: updatedSono,
      },
    });
  };

  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);
  const averageSleep = calculateAverageSleep(allData);
  const sleepData = last7Days.map((dateKey) => {
    const dayData = allData[dateKey];
    return {
      date: dateKey,
      hours: dayData?.sono?.horas || 0,
      isToday: dateKey === todayKey,
    };
  });

  const maxHours = Math.max(...sleepData.map((d) => d.hours), 8);

  return (
    <div className="sono-page">
      <div className="page-header">
        <h1>😴 Sono</h1>
      </div>

      <div className="sono-grid">
        <Card title="Registro de Hoje" icon="🌙">
          <div className="sono-input-container">
            <label>Horas de sono:</label>
            <div className="sono-input-group">
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sonoData.horas || 0}
                onChange={(e) => handleHoursChange(Number(e.target.value))}
                className="sono-input"
                placeholder="Ex: 7.5"
              />
              <span className="sono-unit">horas</span>
            </div>
          </div>

          <div className="sono-status">
            <div className="status-item">
              <span className="status-label">Sono de hoje:</span>
              <span className="status-value">
                {sonoData.horas > 0 ? `${sonoData.horas}h` : 'Não registrado'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Média Semanal" icon="📊">
          <div className="average-sleep">
            <div className="average-number">{averageSleep}</div>
            <div className="average-label">horas de sono (média dos últimos 7 dias)</div>
          </div>
        </Card>

        <Card title="Histórico Semanal" icon="📈" className="history-card">
          <div className="sleep-chart">
            {sleepData.map((data) => (
              <div key={data.date} className="sleep-bar-container">
                <div className="sleep-bar-label">
                  <span>{formatDateShort(data.date)}</span>
                  {data.isToday && <span className="today-badge">Hoje</span>}
                </div>
                <div className="sleep-bar-wrapper">
                  <div
                    className={`sleep-bar ${data.isToday ? 'today' : ''} ${data.hours === 0 ? 'empty' : ''}`}
                    style={{
                      width: `${data.hours > 0 ? (data.hours / maxHours) * 100 : 5}%`,
                    }}
                  >
                    <span className="sleep-bar-value">{data.hours > 0 ? `${data.hours}h` : '--'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

