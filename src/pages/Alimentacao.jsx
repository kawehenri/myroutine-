import { useLocalStorage } from '../hooks/useLocalStorage';
import { getDateKey, formatDateShort, getDaysSinceProfileCreation } from '../utils/dateHelpers';
import Card from '../components/Card';
import './Alimentacao.css';

export default function Alimentacao() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const todayKey = getDateKey();
  const todayData = allData[todayKey] || {};
  const alimentacaoData = todayData.alimentacao || {
    cafe: false,
    almoco: false,
    jantar: false,
  };
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const handleToggleMeal = (meal) => {
    const updatedAlimentacao = {
      ...alimentacaoData,
      [meal]: !alimentacaoData[meal],
    };

    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        alimentacao: updatedAlimentacao,
      },
    });
  };

  const meals = [
    { key: 'cafe', label: 'Café da Manhã', icon: '☕' },
    { key: 'almoco', label: 'Almoço', icon: '🍽️' },
    { key: 'jantar', label: 'Jantar', icon: '🌙' },
  ];

  const completedMeals = meals.filter((meal) => alimentacaoData[meal.key]).length;
  const totalMeals = meals.length;

  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);
  const weeklyMeals = last7Days.map((dateKey) => {
    const dayData = allData[dateKey];
    const alimentacao = dayData?.alimentacao || { cafe: false, almoco: false, jantar: false };
    const completed = Object.values(alimentacao).filter(Boolean).length;
    return {
      date: dateKey,
      completed,
      total: totalMeals,
      isToday: dateKey === todayKey,
    };
  });

  return (
    <div className="alimentacao-page">
      <div className="page-header">
        <h1>🍽️ Alimentação</h1>
      </div>

      <div className="alimentacao-grid">
        <Card title="Refeições de Hoje" icon="📋">
          <div className="meals-progress">
            <div className="progress-text">
              <span className="progress-label">Progresso:</span>
              <span className="progress-value">
                {completedMeals}/{totalMeals} refeições
              </span>
            </div>
            <div className="progress-bar-visual">
              <div
                className="progress-bar-fill"
                style={{ width: `${(completedMeals / totalMeals) * 100}%` }}
              />
            </div>
          </div>

          <div className="meals-list">
            {meals.map((meal) => (
              <div
                key={meal.key}
                className={`meal-item ${alimentacaoData[meal.key] ? 'completed' : ''}`}
              >
                <label className="meal-checkbox">
                  <input
                    type="checkbox"
                    checked={alimentacaoData[meal.key]}
                    onChange={() => handleToggleMeal(meal.key)}
                  />
                  <span className="meal-icon">{meal.icon}</span>
                  <span className="meal-label">{meal.label}</span>
                </label>
                {alimentacaoData[meal.key] && (
                  <span className="meal-check">✅</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Histórico Semanal" icon="📊">
          <div className="weekly-summary">
            <div className="summary-stats">
              <div className="summary-stat">
                <div className="stat-number">
                  {weeklyMeals.reduce((sum, d) => sum + d.completed, 0)}
                </div>
                <div className="stat-label">Refeições esta semana</div>
              </div>
            </div>
          </div>

          <div className="history-list">
            {last7Days.map((dateKey) => {
              const weeklyData = weeklyMeals.find((d) => d.date === dateKey);
              return (
                <div
                  key={dateKey}
                  className={`history-item ${weeklyData?.isToday ? 'today' : ''}`}
                >
                  <div className="history-date">
                    <span>{formatDateShort(dateKey)}</span>
                    {weeklyData?.isToday && <span className="today-badge">Hoje</span>}
                  </div>
                  <div className="history-info">
                    <span className="history-meals">
                      {weeklyData?.completed}/{weeklyData?.total}
                    </span>
                    <div className="history-bars">
                      {meals.map((meal) => {
                        const dayData = allData[dateKey];
                        const alimentacao = dayData?.alimentacao || {};
                        return (
                          <span
                            key={meal.key}
                            className={`meal-bar ${alimentacao[meal.key] ? 'completed' : ''}`}
                          >
                            {meal.icon}
                          </span>
                        );
                      })}
                    </div>
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

