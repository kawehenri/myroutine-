import { useApp } from '../contexts/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Card from '../components/Card';
import './Configuracoes.css';

export default function Configuracoes() {
  const { config, updateConfig, showToast } = useApp();
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [metas] = useLocalStorage('metas', []);
  const [habitos] = useLocalStorage('habitos', []);

  const handleExportData = () => {
    const exportData = {
      routineData: allData,
      metas,
      habitos,
      config,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `myroutine-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('✅ Dados exportados com sucesso!', 'success');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        if (!importData.routineData || !importData.version) {
          throw new Error('Arquivo inválido');
        }

        // Confirmar antes de importar
        if (window.confirm('Isso substituirá todos os dados atuais. Deseja continuar?')) {
          localStorage.setItem('routineData', JSON.stringify(importData.routineData));
          if (importData.metas) {
            localStorage.setItem('metas', JSON.stringify(importData.metas));
          }
          if (importData.habitos) {
            localStorage.setItem('habitos', JSON.stringify(importData.habitos));
          }
          if (importData.config) {
            localStorage.setItem('config', JSON.stringify(importData.config));
          }

          showToast('✅ Dados importados com sucesso!', 'success');
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (error) {
        showToast('❌ Erro ao importar dados. Verifique o arquivo.', 'error');
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ Isso apagará TODOS os seus dados permanentemente. Tem certeza?')) {
      if (window.confirm('🚨 ÚLTIMA CONFIRMAÇÃO: Seus dados serão perdidos para sempre!')) {
        localStorage.clear();
        showToast('Dados apagados', 'info');
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  };

  const totalDays = Object.keys(allData).length;
  const dataSize = new Blob([JSON.stringify(allData)]).size;
  const dataSizeKB = (dataSize / 1024).toFixed(2);

  return (
    <div className="configuracoes-page">
      <div className="page-header">
        <h1>⚙️ Configurações</h1>
      </div>

      <div className="config-grid">
        <Card title="Preferências" icon="🔧">
          <div className="config-section">
            <div className="config-item">
              <div className="config-label">
                <span>Meta de Sono (horas)</span>
                <p className="config-description">Sua meta diária de sono</p>
              </div>
              <input
                type="number"
                min="4"
                max="12"
                value={config.defaultSleepGoal}
                onChange={(e) => updateConfig({ defaultSleepGoal: Number(e.target.value) })}
                className="config-input"
              />
            </div>

            <div className="config-item">
              <div className="config-label">
                <span>Notificações</span>
                <p className="config-description">Mostrar mensagens de feedback</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.notifications}
                  onChange={(e) => updateConfig({ notifications: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </Card>

        <Card title="Dados" icon="💾">
          <div className="config-section">
            <div className="data-info">
              <div className="data-info-item">
                <span className="data-info-label">Total de dias registrados:</span>
                <span className="data-info-value">{totalDays}</span>
              </div>
              <div className="data-info-item">
                <span className="data-info-label">Metas criadas:</span>
                <span className="data-info-value">{metas.length}</span>
              </div>
              <div className="data-info-item">
                <span className="data-info-label">Hábitos personalizados:</span>
                <span className="data-info-value">{habitos.length}</span>
              </div>
              <div className="data-info-item">
                <span className="data-info-label">Tamanho dos dados:</span>
                <span className="data-info-value">{dataSizeKB} KB</span>
              </div>
            </div>

            <div className="config-actions">
              <button className="btn-action btn-export" onClick={handleExportData}>
                📥 Exportar Dados
              </button>
              <label className="btn-action btn-import">
                📤 Importar Dados
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  style={{ display: 'none' }}
                />
              </label>
              <button className="btn-action btn-danger" onClick={handleClearData}>
                🗑️ Apagar Todos os Dados
              </button>
            </div>
          </div>
        </Card>

        <Card title="Sobre" icon="ℹ️">
          <div className="about-section">
            <h3>My Routine v1.0</h3>
            <p>Sistema completo de organização pessoal</p>
            <p className="about-tech">React + Vite + localStorage</p>
            <p className="about-developer">
              <strong>Desenvolvido por Kawê Henrique</strong>
            </p>
            <p className="about-note">
              💡 Todos os seus dados são salvos localmente no seu navegador.
              Recomendamos fazer backups regulares usando a opção "Exportar Dados".
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

