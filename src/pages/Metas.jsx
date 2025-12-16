import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import { getDaysSinceProfileCreation } from '../utils/dateHelpers';
import { calculateStudyTime, calculateTotalFocusTime } from '../utils/calculations';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import './Metas.css';

export default function Metas() {
  const [allData] = useLocalStorage('routineData', {});
  const [metas, setMetas] = useLocalStorage('metas', []);
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const { showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState(null);
  const [newMeta, setNewMeta] = useState({
    titulo: '',
    tipo: 'semanal', // semanal ou mensal
    categoria: 'estudo',
    valorAlvo: 0,
    unidade: 'minutos',
  });
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const categorias = [
    { value: 'estudo', label: '📚 Tempo de Estudo', unidade: 'minutos' },
    { value: 'treino', label: '🏋️ Dias de Treino', unidade: 'dias' },
    { value: 'sono', label: '😴 Média de Sono', unidade: 'horas' },
    { value: 'foco', label: '⏱️ Tempo Focado', unidade: 'minutos' },
  ];

  const handleAddMeta = () => {
    if (!newMeta.titulo.trim() || newMeta.valorAlvo <= 0) {
      showToast('Preencha todos os campos corretamente', 'error');
      return;
    }

    const meta = {
      id: editingMeta ? editingMeta.id : Date.now(),
      titulo: newMeta.titulo,
      tipo: newMeta.tipo,
      categoria: newMeta.categoria,
      valorAlvo: newMeta.valorAlvo,
      unidade: newMeta.unidade,
      criadaEm: editingMeta ? editingMeta.criadaEm : new Date().toISOString(),
    };

    if (editingMeta) {
      setMetas(metas.map((m) => (m.id === editingMeta.id ? meta : m)));
      showToast('Meta atualizada com sucesso!', 'success');
    } else {
      setMetas([...metas, meta]);
      showToast('Meta adicionada com sucesso!', 'success');
    }

    resetForm();
  };

  const handleDeleteMeta = (metaId) => {
    setMetas(metas.filter((m) => m.id !== metaId));
    showToast('Meta excluída', 'info');
  };

  const handleEditMeta = (meta) => {
    setNewMeta({
      titulo: meta.titulo,
      tipo: meta.tipo,
      categoria: meta.categoria,
      valorAlvo: meta.valorAlvo,
      unidade: meta.unidade,
    });
    setEditingMeta(meta);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewMeta({
      titulo: '',
      tipo: 'semanal',
      categoria: 'estudo',
      valorAlvo: 0,
      unidade: 'minutos',
    });
    setEditingMeta(null);
    setIsModalOpen(false);
  };

  const calculateMetaProgress = (meta) => {
    const days = meta.tipo === 'semanal' ? 7 : 30;
    const lastDays = getDaysSinceProfileCreation(dataCriacao, days);
    
    let total = 0;
    
    switch (meta.categoria) {
      case 'estudo':
        lastDays.forEach((dateKey) => {
          const dayData = allData[dateKey];
          total += calculateStudyTime(dayData);
        });
        break;
      case 'treino':
        lastDays.forEach((dateKey) => {
          const dayData = allData[dateKey];
          if (dayData?.treino?.feito) total++;
        });
        break;
      case 'sono':
        let sonoTotal = 0;
        let diasComSono = 0;
        lastDays.forEach((dateKey) => {
          const dayData = allData[dateKey];
          if (dayData?.sono?.horas) {
            sonoTotal += dayData.sono.horas;
            diasComSono++;
          }
        });
        total = diasComSono > 0 ? sonoTotal / diasComSono : 0;
        break;
      case 'foco':
        lastDays.forEach((dateKey) => {
          const dayData = allData[dateKey];
          total += calculateTotalFocusTime(dayData);
        });
        break;
      default:
        break;
    }
    
    return {
      atual: meta.categoria === 'sono' ? total.toFixed(1) : Math.round(total),
      percentual: Math.min((total / meta.valorAlvo) * 100, 100),
    };
  };

  return (
    <div className="metas-page">
      <div className="page-header">
        <h1>🎯 Metas</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Nova Meta
        </button>
      </div>

      {metas.length === 0 ? (
        <Card title="Comece a definir suas metas!" icon="🎯">
          <p className="empty-state">
            Defina metas semanais ou mensais para acompanhar seu progresso e alcançar seus objetivos!
          </p>
        </Card>
      ) : (
        <div className="metas-grid">
          {metas.map((meta) => {
            const progress = calculateMetaProgress(meta);
            const isCompleted = progress.percentual >= 100;
            
            return (
              <Card key={meta.id} title={meta.titulo} icon="🎯" className={isCompleted ? 'meta-completed' : ''}>
                <div className="meta-info">
                  <div className="meta-badge">{meta.tipo === 'semanal' ? 'Semanal' : 'Mensal'}</div>
                  <div className="meta-category">
                    {categorias.find((c) => c.value === meta.categoria)?.label}
                  </div>
                </div>

                <div className="meta-progress">
                  <ProgressBar
                    value={progress.percentual}
                    max={100}
                    label={`${progress.atual} / ${meta.valorAlvo} ${meta.unidade}`}
                  />
                </div>

                {isCompleted && (
                  <div className="meta-achievement">
                    🏆 Meta Alcançada!
                  </div>
                )}

                <div className="meta-actions">
                  <button className="btn-edit" onClick={() => handleEditMeta(meta)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteMeta(meta.id)}>
                    🗑️ Excluir
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingMeta ? 'Editar Meta' : 'Nova Meta'}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Título da Meta:</label>
            <input
              type="text"
              value={newMeta.titulo}
              onChange={(e) => setNewMeta({ ...newMeta, titulo: e.target.value })}
              placeholder="Ex: Estudar 10 horas esta semana"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Período:</label>
              <select
                value={newMeta.tipo}
                onChange={(e) => setNewMeta({ ...newMeta, tipo: e.target.value })}
                className="form-input"
              >
                <option value="semanal">Semanal (7 dias)</option>
                <option value="mensal">Mensal (30 dias)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Categoria:</label>
              <select
                value={newMeta.categoria}
                onChange={(e) => {
                  const categoria = categorias.find((c) => c.value === e.target.value);
                  setNewMeta({
                    ...newMeta,
                    categoria: e.target.value,
                    unidade: categoria.unidade,
                  });
                }}
                className="form-input"
              >
                {categorias.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Valor Alvo:</label>
            <div className="input-with-unit">
              <input
                type="number"
                min="1"
                value={newMeta.valorAlvo}
                onChange={(e) => setNewMeta({ ...newMeta, valorAlvo: Number(e.target.value) })}
                className="form-input"
              />
              <span className="input-unit">{newMeta.unidade}</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleAddMeta}>
              {editingMeta ? 'Salvar Alterações' : 'Adicionar Meta'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

