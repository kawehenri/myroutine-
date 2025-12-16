import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTimer } from '../hooks/useTimer';
import { useApp } from '../contexts/AppContext';
import { getDateKey, formatDate, getLastDays, formatDateShort, getDaysSinceProfileCreation } from '../utils/dateHelpers';
import { calculateDailyProgress, calculateWeeklyProgress, calculateTotalFocusTime, calculateStudyTime, calculateAverageSleep } from '../utils/calculations';
import { calculateStreak, getStreakMessage, calculateBestStreak } from '../utils/streakHelpers';
import { getMotivationalMessage, getPerformanceMessage } from '../utils/motivationalMessages';
import Card from '../components/Card';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import './Dashboard.css';

export default function Dashboard() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const [timerCategory, setTimerCategory] = useState('estudo');
  const [initialTimerSeconds, setInitialTimerSeconds] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const { showToast } = useApp();
  const todayKey = getDateKey();
  const todayData = allData[todayKey] || {};
  const [notas, setNotas] = useState(todayData.notas || '');

  // Mensagem de boas-vindas
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = getDateKey();
    
    if (lastVisit !== today) {
      setShowWelcome(true);
      localStorage.setItem('lastVisit', today);
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, []);

  const timer = useTimer(() => {
    handleTimerComplete();
  });

  const handleTimerStart = (seconds, category) => {
    setTimerCategory(category);
    setInitialTimerSeconds(seconds);
    timer.start(seconds);
  };

  const handleTimerComplete = () => {
    const todayKey = getDateKey();
    const todayData = allData[todayKey] || {};
    const timerData = todayData.timer || {};
    
    const minutes = Math.floor(initialTimerSeconds / 60);
    if (minutes > 0) {
      timerData[timerCategory] = (timerData[timerCategory] || 0) + minutes;
      
      setAllData({
        ...allData,
        [todayKey]: {
          ...todayData,
          timer: timerData,
        },
      });
    }
    setInitialTimerSeconds(0);
  };

  const handleTimerStop = () => {
    const todayKey = getDateKey();
    const todayData = allData[todayKey] || {};
    const timerData = todayData.timer || {};
    
    const elapsedSeconds = initialTimerSeconds - timer.seconds;
    const minutes = Math.floor(elapsedSeconds / 60);
    
    if (minutes > 0) {
      timerData[timerCategory] = (timerData[timerCategory] || 0) + minutes;
      
      setAllData({
        ...allData,
        [todayKey]: {
          ...todayData,
          timer: timerData,
        },
      });
    }
    
    setInitialTimerSeconds(0);
    timer.stop();
  };

  // Obter data de criação do perfil (deve vir primeiro)
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const dailyProgress = calculateDailyProgress(todayData);
  const weeklyProgress = calculateWeeklyProgress(allData, dataCriacao);
  const totalFocusTime = calculateTotalFocusTime(todayData);

  // Streaks
  const estudoStreak = calculateStreak(allData, 'estudo');
  const treinoStreak = calculateStreak(allData, 'treino');

  // Eventos do cronograma de hoje
  const cronogramaData = todayData.cronograma || [];
  const proximosEventos = cronogramaData
    .filter((e) => !e.concluido)
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 3);

  // Mensagens
  const motivationalMsg = getMotivationalMessage();
  const performanceMsg = getPerformanceMessage(weeklyProgress);
  
  // Estatísticas (unidas ao Dashboard) - considerar apenas desde criação do perfil
  const last30Days = getDaysSinceProfileCreation(dataCriacao, 30);
  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);
  const totalDiasPerfil = last30Days.length;
  
  const totalEstudo30 = last30Days.reduce((sum, date) => sum + calculateStudyTime(allData[date]), 0);
  const totalEstudo7 = last7Days.reduce((sum, date) => sum + calculateStudyTime(allData[date]), 0);
  const mediaEstudo = totalDiasPerfil > 0 ? Math.round(totalEstudo30 / totalDiasPerfil) : 0;
  
  const diasTreino30 = last30Days.filter((date) => allData[date]?.treino?.feito).length;
  const diasTreino7 = last7Days.filter((date) => allData[date]?.treino?.feito).length;
  const percentualTreino = totalDiasPerfil > 0 ? Math.round((diasTreino30 / totalDiasPerfil) * 100) : 0;
  
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
  
  const totalFoco30 = last30Days.reduce((sum, date) => sum + calculateTotalFocusTime(allData[date]), 0);
  const mediaFoco = totalDiasPerfil > 0 ? Math.round(totalFoco30 / totalDiasPerfil) : 0;
  
  const estudoBestStreak = calculateBestStreak(allData, 'estudo');
  const treinoBestStreak = calculateBestStreak(allData, 'treino');

  const handleSaveNotas = () => {
    setAllData({
      ...allData,
      [todayKey]: {
        ...todayData,
        notas,
      },
    });
    showToast('Notas salvas!', 'success');
  };

  return (
    <div className="dashboard">
      {showWelcome && perfilAtual && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-icon">{perfilAtual.icone}</span>
            <div>
              <h2 className="welcome-title">Bem-vindo, {perfilAtual.nome}!</h2>
              <p className="welcome-subtitle">Que seu dia seja produtivo e cheio de conquistas! 🚀</p>
            </div>
            <button className="welcome-close" onClick={() => setShowWelcome(false)}>×</button>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-date">{formatDate(todayKey)}</p>
      </div>

      <div className="motivational-banner">
        <div className="motivational-message">{motivationalMsg}</div>
        <div className="performance-message">{performanceMsg}</div>
      </div>

      <div className="dashboard-grid">
        <Card title="Timer de Foco" icon="⏱️" className="timer-card">
          <Timer
            timer={timer}
            onStart={handleTimerStart}
            onPause={timer.pause}
            onResume={timer.resume}
            onStop={handleTimerStop}
            onCategoryChange={setTimerCategory}
          />
        </Card>

        <Card title="Progresso Diário" icon="📊">
          <ProgressBar value={dailyProgress} label="Hoje" />
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">Estudo:</span>
              <span className={`stat-value ${todayData.estudo?.concluido ? 'completed' : ''}`}>
                {todayData.estudo?.concluido ? '✅ Feito' : '❌ Não feito'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Treino:</span>
              <span className={`stat-value ${todayData.treino?.feito ? 'completed' : ''}`}>
                {todayData.treino?.feito ? '✅ Feito' : '❌ Não feito'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sono:</span>
              <span className="stat-value">
                {todayData.sono?.horas ? `${todayData.sono.horas}h` : 'Não registrado'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tempo Focado:</span>
              <span className="stat-value">{totalFocusTime} min</span>
            </div>
          </div>
        </Card>

        <Card title="Progresso Semanal" icon="📈">
          <ProgressBar value={weeklyProgress} label="Esta Semana" />
          <p className="weekly-info">
            Média de {weeklyProgress}% de conclusão nos últimos 7 dias
          </p>
        </Card>

        <Card title="Sequências (Streaks)" icon="🔥">
          <div className="streaks-container">
            <div className="streak-box">
              <div className="streak-icon">📚</div>
              <div className="streak-info">
                <div className="streak-label">Estudo</div>
                <div className="streak-value">{estudoStreak} dias</div>
                <div className="streak-msg">{getStreakMessage(estudoStreak)}</div>
              </div>
            </div>
            <div className="streak-box">
              <div className="streak-icon">🏋️</div>
              <div className="streak-info">
                <div className="streak-label">Treino</div>
                <div className="streak-value">{treinoStreak} dias</div>
                <div className="streak-msg">{getStreakMessage(treinoStreak)}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Próximos Eventos de Hoje" icon="📅">
          {proximosEventos.length === 0 ? (
            <p className="empty-state-small">Nenhum evento pendente hoje</p>
          ) : (
            <div className="next-events-list">
              {proximosEventos.map((evento) => (
                <div key={evento.id} className="next-event-item">
                  <div className="event-time-badge">{evento.hora}</div>
                  <div className="event-details">
                    <div className="event-title-small">{evento.titulo}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/cronograma" className="btn-link">
            Ver Cronograma Completo →
          </Link>
        </Card>

        <Card title="Notas do Dia" icon="📝">
          <textarea
            className="notas-textarea"
            placeholder="Escreva suas anotações, reflexões ou lembretes do dia..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows="4"
          />
          <button className="btn-save-notas" onClick={handleSaveNotas}>
            💾 Salvar Notas
          </button>
        </Card>

        <Card title="Resumo do Dia" icon="📋">
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-icon">📚</div>
              <div className="summary-text">
                <div className="summary-label">Estudos</div>
                <div className="summary-value">
                  {todayData.estudo?.tempoEstudado || 0} min
                </div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon">🏋️</div>
              <div className="summary-text">
                <div className="summary-label">Treino</div>
                <div className="summary-value">
                  {todayData.treino?.feito ? '✅' : '❌'}
                </div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon">😴</div>
              <div className="summary-text">
                <div className="summary-label">Sono</div>
                <div className="summary-value">
                  {todayData.sono?.horas || '--'}h
                </div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon">🍽️</div>
              <div className="summary-text">
                <div className="summary-label">Refeições</div>
                <div className="summary-value">
                  {todayData.alimentacao 
                    ? `${[todayData.alimentacao.cafe, todayData.alimentacao.almoco, todayData.alimentacao.jantar].filter(Boolean).length}/3`
                    : '0/3'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Estatísticas - 30 Dias" icon="📊" className="stats-card">
          <div className="stats-grid">
            <div className="stat-card-item">
              <div className="stat-card-icon">📚</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Tempo de Estudo</div>
                <div className="stat-card-value">{Math.round(totalEstudo30 / 60)}h {totalEstudo30 % 60}min</div>
                <div className="stat-card-secondary">Média: {mediaEstudo} min/dia</div>
              </div>
            </div>

            <div className="stat-card-item">
              <div className="stat-card-icon">🏋️</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Treinos</div>
                <div className="stat-card-value">{diasTreino30} dias</div>
                <div className="stat-card-secondary">{percentualTreino}% dos dias</div>
              </div>
            </div>

            <div className="stat-card-item">
              <div className="stat-card-icon">😴</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Sono Médio</div>
                <div className="stat-card-value">{mediaSono}h</div>
                <div className="stat-card-secondary">{diasComSono} dias registrados</div>
              </div>
            </div>

            <div className="stat-card-item">
              <div className="stat-card-icon">⏱️</div>
              <div className="stat-card-content">
                <div className="stat-card-label">Tempo Focado</div>
                <div className="stat-card-value">{Math.round(totalFoco30 / 60)}h {totalFoco30 % 60}min</div>
                <div className="stat-card-secondary">Média: {mediaFoco} min/dia</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Melhores Sequências" icon="🏆" className="best-streaks-card">
          <div className="best-streaks-grid">
            <div className="best-streak-item">
              <div className="best-streak-icon">📚</div>
              <div className="best-streak-info">
                <div className="best-streak-label">Melhor Sequência - Estudo</div>
                <div className="best-streak-value">{estudoBestStreak} dias</div>
              </div>
            </div>
            <div className="best-streak-item">
              <div className="best-streak-icon">🏋️</div>
              <div className="best-streak-info">
                <div className="best-streak-label">Melhor Sequência - Treino</div>
                <div className="best-streak-value">{treinoBestStreak} dias</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

