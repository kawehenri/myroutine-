/**
 * Retorna uma mensagem motivacional aleatória
 * @returns {string}
 */
export function getMotivationalMessage() {
  const messages = [
    '🌟 Cada dia é uma nova oportunidade!',
    '💪 O sucesso é a soma de pequenos esforços repetidos!',
    '🚀 Você é mais forte do que pensa!',
    '🎯 Foco no processo, não apenas no resultado!',
    '🔥 A disciplina é o caminho para a liberdade!',
    '⭐ Pequenos passos todos os dias!',
    '🌈 Sua dedicação vai valer a pena!',
    '💎 A excelência é um hábito!',
    '🏆 Você está construindo seu futuro hoje!',
    '🎨 Cada dia é uma nova página em branco!',
    '🌱 O crescimento acontece fora da zona de conforto!',
    '✨ Acredite no seu potencial!',
    '🎪 A jornada é tão importante quanto o destino!',
    '💎 Transformação requer consistência!',
    '🌟 Seja a melhor versão de você mesmo!',
    '💫 Progresso, não perfeição!',
    '🎯 Mantenha o foco nos seus objetivos!',
    '🔥 Motivação te faz começar, hábito te faz continuar!',
    '🌊 Seja como a água: persistente e adaptável!',
    '🎭 Sua rotina define seu futuro!',
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Retorna mensagem baseada no desempenho semanal
 * @param {number} weeklyProgress - Progresso semanal (0-100)
 * @returns {string}
 */
export function getPerformanceMessage(weeklyProgress) {
  if (weeklyProgress >= 90) return '🏆 Desempenho excepcional! Continue assim!';
  if (weeklyProgress >= 70) return '🌟 Ótimo trabalho esta semana!';
  if (weeklyProgress >= 50) return '💪 Você está no caminho certo!';
  if (weeklyProgress >= 30) return '🎯 Vamos dar um gás esta semana!';
  return '🌱 Toda jornada começa com um passo!';
}

