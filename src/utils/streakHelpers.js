import { getDateKey } from './dateHelpers';

/**
 * Calcula a sequência de dias consecutivos para uma categoria
 * @param {object} allData - Todos os dados salvos
 * @param {string} category - Categoria (estudo, treino, etc)
 * @returns {number} - Número de dias consecutivos
 */
export function calculateStreak(allData, category) {
  let streak = 0;
  let date = new Date();
  
  while (true) {
    const dateKey = getDateKey(date);
    const dayData = allData[dateKey];
    
    let hasDone = false;
    
    switch (category) {
      case 'estudo':
        hasDone = dayData?.estudo?.concluido || false;
        break;
      case 'treino':
        hasDone = dayData?.treino?.feito || false;
        break;
      case 'sono':
        hasDone = dayData?.sono?.horas && dayData.sono.horas >= 6;
        break;
      case 'alimentacao':
        const alim = dayData?.alimentacao;
        hasDone = alim?.cafe && alim?.almoco && alim?.jantar;
        break;
      default:
        break;
    }
    
    if (hasDone) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calcula a melhor sequência de todos os tempos
 * @param {object} allData - Todos os dados salvos
 * @param {string} category - Categoria
 * @returns {number} - Melhor sequência
 */
export function calculateBestStreak(allData, category) {
  const dates = Object.keys(allData).sort();
  let bestStreak = 0;
  let currentStreak = 0;
  let lastDate = null;
  
  dates.forEach((dateKey) => {
    const dayData = allData[dateKey];
    let hasDone = false;
    
    switch (category) {
      case 'estudo':
        hasDone = dayData?.estudo?.concluido || false;
        break;
      case 'treino':
        hasDone = dayData?.treino?.feito || false;
        break;
      case 'sono':
        hasDone = dayData?.sono?.horas && dayData.sono.horas >= 6;
        break;
      case 'alimentacao':
        const alim = dayData?.alimentacao;
        hasDone = alim?.cafe && alim?.almoco && alim?.jantar;
        break;
      default:
        break;
    }
    
    if (hasDone) {
      if (lastDate && isConsecutiveDay(lastDate, dateKey)) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      bestStreak = Math.max(bestStreak, currentStreak);
      lastDate = dateKey;
    } else {
      currentStreak = 0;
    }
  });
  
  return bestStreak;
}

function isConsecutiveDay(date1, date2) {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diff = Math.abs(d2 - d1) / (1000 * 60 * 60 * 24);
  return diff === 1;
}

/**
 * Retorna mensagem motivacional baseada no streak
 * @param {number} streak - Número de dias consecutivos
 * @returns {string}
 */
export function getStreakMessage(streak) {
  if (streak === 0) return 'Comece sua sequência hoje! 💪';
  if (streak === 1) return 'Primeiro dia! Continue assim! 🎯';
  if (streak < 7) return `${streak} dias seguidos! Você está no caminho certo! 🔥`;
  if (streak < 30) return `${streak} dias! Incrível! Continue firme! 🌟`;
  if (streak < 100) return `${streak} dias! Você é imparável! 🚀`;
  return `${streak} dias! LENDÁRIO! 👑`;
}

