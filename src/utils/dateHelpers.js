/**
 * Retorna a data no formato YYYY-MM-DD
 * @param {Date} date - Data (padrão: hoje)
 * @returns {string}
 */
export function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna a data formatada para exibição
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @returns {string}
 */
export function formatDate(dateKey) {
  const date = new Date(dateKey + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Retorna a data formatada de forma curta
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @returns {string}
 */
export function formatDateShort(dateKey) {
  const date = new Date(dateKey + 'T00:00:00');
  const options = { day: '2-digit', month: '2-digit' };
  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Retorna os últimos N dias
 * @param {number} days - Número de dias
 * @returns {string[]} - Array de chaves de data
 */
export function getLastDays(days = 7) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(getDateKey(date));
  }
  return dates;
}

/**
 * Verifica se uma data é hoje
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @returns {boolean}
 */
export function isToday(dateKey) {
  return dateKey === getDateKey();
}

/**
 * Retorna o dia da semana
 * @param {string} dateKey - Data no formato YYYY-MM-DD
 * @returns {string}
 */
export function getWeekday(dateKey) {
  const date = new Date(dateKey + 'T00:00:00');
  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return weekdays[date.getDay()];
}

/**
 * Retorna os dias desde a criação do perfil até hoje
 * @param {string} criadoEm - Data ISO string de criação
 * @param {number} maxDays - Número máximo de dias (padrão: 30)
 * @returns {string[]} - Array de chaves de data
 */
export function getDaysSinceProfileCreation(criadoEm, maxDays = 30) {
  if (!criadoEm) return getLastDays(maxDays);
  
  const createdDate = new Date(criadoEm);
  const today = new Date();
  const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
  const actualDays = Math.min(daysDiff + 1, maxDays); // +1 para incluir hoje
  
  const dates = [];
  for (let i = actualDays - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = getDateKey(date);
    
    // Só adicionar se a data for >= data de criação
    if (new Date(dateKey + 'T00:00:00') >= createdDate) {
      dates.push(dateKey);
    }
  }
  
  return dates;
}

