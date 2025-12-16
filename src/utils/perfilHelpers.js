/**
 * Retorna a data de criação do perfil ativo
 * @param {Array} perfis - Lista de perfis
 * @param {number} perfilAtivo - ID do perfil ativo
 * @returns {string} - Data ISO string ou data atual
 */
export function getPerfilCreationDate(perfis, perfilAtivo) {
  const perfil = perfis.find(p => p.id === perfilAtivo);
  return perfil?.criadoEm || new Date().toISOString();
}

/**
 * Filtra dados apenas desde a criação do perfil
 * @param {Object} allData - Todos os dados
 * @param {string} dataCriacao - Data de criação do perfil (ISO string)
 * @returns {Object} - Dados filtrados
 */
export function filterDataSinceCreation(allData, dataCriacao) {
  if (!dataCriacao) return allData;
  
  const createdDate = new Date(dataCriacao);
  const filtered = {};
  
  Object.keys(allData).forEach((dateKey) => {
    const date = new Date(dateKey + 'T00:00:00');
    if (date >= createdDate) {
      filtered[dateKey] = allData[dateKey];
    }
  });
  
  return filtered;
}

