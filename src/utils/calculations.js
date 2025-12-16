import { getLastDays, getDaysSinceProfileCreation } from './dateHelpers';

/**
 * Calcula o progresso diário baseado em tarefas completadas
 * @param {object} dayData - Dados do dia
 * @returns {number} - Porcentagem de 0 a 100
 */
export function calculateDailyProgress(dayData) {
  if (!dayData) return 0;
  
  let completed = 0;
  let total = 4; // estudo, treino, sono, alimentação

  if (dayData.estudo?.concluido) completed++;
  if (dayData.treino?.feito) completed++;
  if (dayData.sono?.horas && dayData.sono.horas > 0) completed++;
  if (dayData.alimentacao?.cafe && dayData.alimentacao?.almoco && dayData.alimentacao?.jantar) {
    completed++;
  }

  return Math.round((completed / total) * 100);
}

/**
 * Calcula o progresso semanal
 * @param {object} allData - Todos os dados salvos
 * @param {string} dataCriacao - Data de criação do perfil (opcional)
 * @returns {number} - Porcentagem de 0 a 100
 */
export function calculateWeeklyProgress(allData, dataCriacao = null) {
  const last7Days = dataCriacao ? getDaysSinceProfileCreation(dataCriacao, 7) : getLastDays(7);
  let totalProgress = 0;
  let daysWithData = 0;

  last7Days.forEach((dateKey) => {
    const dayData = allData[dateKey];
    if (dayData) {
      totalProgress += calculateDailyProgress(dayData);
      daysWithData++;
    }
  });

  return daysWithData > 0 ? Math.round(totalProgress / daysWithData) : 0;
}

/**
 * Calcula o tempo total focado no dia
 * @param {object} dayData - Dados do dia
 * @returns {number} - Minutos totais
 */
export function calculateTotalFocusTime(dayData) {
  if (!dayData || !dayData.timer) return 0;
  
  let total = 0;
  if (dayData.timer.estudo) total += dayData.timer.estudo;
  if (dayData.timer.trabalho) total += dayData.timer.trabalho;
  if (dayData.timer.treino) total += dayData.timer.treino;

  return total;
}

/**
 * Calcula a média de horas de sono dos últimos 7 dias
 * @param {object} allData - Todos os dados salvos
 * @returns {number} - Média de horas
 */
export function calculateAverageSleep(allData) {
  const last7Days = getLastDays(7);
  let totalHours = 0;
  let daysWithSleep = 0;

  last7Days.forEach((dateKey) => {
    const dayData = allData[dateKey];
    if (dayData?.sono?.horas) {
      totalHours += dayData.sono.horas;
      daysWithSleep++;
    }
  });

  return daysWithSleep > 0 ? (totalHours / daysWithSleep).toFixed(1) : 0;
}

/**
 * Calcula o total de tempo estudado no dia
 * @param {object} dayData - Dados do dia
 * @returns {number} - Minutos totais
 */
export function calculateStudyTime(dayData) {
  if (!dayData || !dayData.estudo) return 0;
  
  if (dayData.estudo.tempoEstudado) {
    return dayData.estudo.tempoEstudado;
  }

  // Fallback: soma das atividades concluídas
  if (dayData.estudo.atividades) {
    return dayData.estudo.atividades
      .filter(a => a.concluida)
      .reduce((sum, a) => sum + (a.tempoPlanejado || 0), 0);
  }

  return 0;
}

