import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApp } from '../contexts/AppContext';
import { getDateKey, formatDate, formatDateShort, getDaysSinceProfileCreation, getWeekday } from '../utils/dateHelpers';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './Cronograma.css';

export default function Cronograma() {
  const [allData, setAllData] = useLocalStorage('routineData', {});
  const [templates, setTemplates] = useLocalStorage('cronogramaTemplates', []);
  const [perfis] = useLocalStorage('perfis', []);
  const [perfilAtivo] = useLocalStorage('perfilAtivo', null);
  const { showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getDateKey());
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState('dia'); // 'dia' ou 'semana'
  const [templateName, setTemplateName] = useState('');
  const [newEvent, setNewEvent] = useState({
    titulo: '',
    descricao: '',
    hora: '09:00',
    categoria: 'outro',
  });
  
  const perfilAtual = perfis.find(p => p.id === perfilAtivo);
  const dataCriacao = perfilAtual?.criadoEm || new Date().toISOString();

  const todayKey = getDateKey();
  const todayData = allData[selectedDate] || {};
  const cronogramaData = todayData.cronograma || [];

  const categorias = [
    { value: 'estudo', label: '📚 Estudo', color: '#667eea' },
    { value: 'trabalho', label: '💼 Trabalho', color: '#4caf50' },
    { value: 'treino', label: '🏋️ Treino', color: '#ff9800' },
    { value: 'lazer', label: '🎮 Lazer', color: '#e91e63' },
    { value: 'outro', label: '📝 Outro', color: '#9e9e9e' },
  ];

  const handleAddEvent = () => {
    if (!newEvent.titulo.trim()) return;

    const event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      titulo: newEvent.titulo,
      descricao: newEvent.descricao,
      hora: newEvent.hora,
      categoria: newEvent.categoria,
      concluido: editingEvent ? editingEvent.concluido : false,
    };

    const updatedCronograma = editingEvent
      ? cronogramaData.map((e) => (e.id === editingEvent.id ? event : e))
      : [...cronogramaData, event].sort((a, b) => a.hora.localeCompare(b.hora));

    const updatedData = {
      ...allData,
      [selectedDate]: {
        ...todayData,
        cronograma: updatedCronograma,
      },
    };

    setAllData(updatedData);
    resetForm();
  };

  const handleDeleteEvent = (eventId) => {
    const updatedCronograma = cronogramaData.filter((e) => e.id !== eventId);
    const updatedData = {
      ...allData,
      [selectedDate]: {
        ...todayData,
        cronograma: updatedCronograma,
      },
    };
    setAllData(updatedData);
  };

  const handleToggleComplete = (eventId) => {
    const updatedCronograma = cronogramaData.map((e) =>
      e.id === eventId ? { ...e, concluido: !e.concluido } : e
    );
    const updatedData = {
      ...allData,
      [selectedDate]: {
        ...todayData,
        cronograma: updatedCronograma,
      },
    };
    setAllData(updatedData);
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      titulo: event.titulo,
      descricao: event.descricao || '',
      hora: event.hora,
      categoria: event.categoria,
    });
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewEvent({
      titulo: '',
      descricao: '',
      hora: '09:00',
      categoria: 'outro',
    });
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleDateChange = (dateKey) => {
    setSelectedDate(dateKey);
  };

  const getCategoriaInfo = (categoriaValue) => {
    return categorias.find((c) => c.value === categoriaValue) || categorias[4];
  };

  const last7Days = getDaysSinceProfileCreation(dataCriacao, 7);
  const weekData = last7Days.map((dateKey) => {
    const dayData = allData[dateKey];
    return {
      date: dateKey,
      events: dayData?.cronograma || [],
      isToday: dateKey === todayKey,
    };
  });

  const totalEvents = cronogramaData.length;
  const completedEvents = cronogramaData.filter((e) => e.concluido).length;

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      showToast('Digite um nome para o template', 'error');
      return;
    }

    if (cronogramaData.length === 0) {
      showToast('Adicione eventos antes de salvar um template', 'error');
      return;
    }

    const template = {
      id: Date.now(),
      nome: templateName,
      eventos: cronogramaData.map(({ id, concluido, ...evento }) => evento),
      criadoEm: new Date().toISOString(),
    };

    setTemplates([...templates, template]);
    showToast(`✅ Template "${templateName}" salvo!`, 'success');
    setTemplateName('');
    setIsTemplateModalOpen(false);
  };

  const handleLoadTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const novosEventos = template.eventos.map((evento) => ({
      ...evento,
      id: Date.now() + Math.random(),
      concluido: false,
    }));

    const updatedData = {
      ...allData,
      [selectedDate]: {
        ...todayData,
        cronograma: [...cronogramaData, ...novosEventos].sort((a, b) =>
          a.hora.localeCompare(b.hora)
        ),
      },
    };

    setAllData(updatedData);
    showToast(`✅ Template "${template.nome}" carregado!`, 'success');
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    showToast('Template excluído', 'info');
  };

  return (
    <div className="cronograma-page">
      <div className="page-header">
        <h1>📅 Cronograma</h1>
        <div className="header-actions">
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'dia' ? 'active' : ''}`}
              onClick={() => setViewMode('dia')}
            >
              Dia
            </button>
            <button
              className={`view-btn ${viewMode === 'semana' ? 'active' : ''}`}
              onClick={() => setViewMode('semana')}
            >
              Semana
            </button>
          </div>
          <button className="btn-secondary" onClick={() => setIsTemplateModalOpen(true)}>
            📋 Templates
          </button>
          <button className="btn-primary" onClick={() => {
            setSelectedDate(todayKey);
            resetForm();
            setIsModalOpen(true);
          }}>
            + Novo Evento
          </button>
        </div>
      </div>

      {viewMode === 'dia' ? (
        <div className="cronograma-grid">
          <Card title={`Cronograma - ${formatDate(selectedDate)}`} icon="📋">
            <div className="date-selector">
              <button
                className="date-nav-btn"
                onClick={() => {
                  const date = new Date(selectedDate + 'T00:00:00');
                  date.setDate(date.getDate() - 1);
                  handleDateChange(getDateKey(date));
                }}
              >
                ← Anterior
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="date-input"
              />
              <button
                className="date-nav-btn"
                onClick={() => {
                  const date = new Date(selectedDate + 'T00:00:00');
                  date.setDate(date.getDate() + 1);
                  handleDateChange(getDateKey(date));
                }}
              >
                Próximo →
              </button>
              {selectedDate !== todayKey && (
                <button
                  className="date-nav-btn today-btn"
                  onClick={() => handleDateChange(todayKey)}
                >
                  Hoje
                </button>
              )}
            </div>

            <div className="cronograma-stats">
              <div className="stat-item">
                <span className="stat-label">Total de eventos:</span>
                <span className="stat-value">{totalEvents}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Concluídos:</span>
                <span className={`stat-value ${completedEvents === totalEvents && totalEvents > 0 ? 'completed' : ''}`}>
                  {completedEvents}/{totalEvents}
                </span>
              </div>
            </div>

            {cronogramaData.length === 0 ? (
              <p className="empty-state">Nenhum evento cadastrado para este dia.</p>
            ) : (
              <div className="events-list">
                {cronogramaData.map((event) => {
                  const categoriaInfo = getCategoriaInfo(event.categoria);
                  return (
                    <div
                      key={event.id}
                      className={`event-item ${event.concluido ? 'completed' : ''}`}
                      style={{ borderLeftColor: categoriaInfo.color }}
                    >
                      <div className="event-time">{event.hora}</div>
                      <div className="event-content">
                        <div className="event-header">
                          <label className="event-checkbox">
                            <input
                              type="checkbox"
                              checked={event.concluido}
                              onChange={() => handleToggleComplete(event.id)}
                            />
                            <span className="event-title">{event.titulo}</span>
                          </label>
                          <span
                            className="event-category"
                            style={{ color: categoriaInfo.color }}
                          >
                            {categoriaInfo.label}
                          </span>
                        </div>
                        {event.descricao && (
                          <p className="event-description">{event.descricao}</p>
                        )}
                      </div>
                      <div className="event-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditEvent(event)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="cronograma-grid week-view">
          {weekData.map((day) => {
            const dayEvents = day.events.sort((a, b) => a.hora.localeCompare(b.hora));
            return (
              <Card
                key={day.date}
                title={`${getWeekday(day.date)} - ${formatDateShort(day.date)}`}
                icon={day.isToday ? '⭐' : '📅'}
                className={day.isToday ? 'today-card' : ''}
              >
                <div className="week-day-header">
                  {day.isToday && <span className="today-badge">Hoje</span>}
                  <span className="events-count">{dayEvents.length} eventos</span>
                </div>
                {dayEvents.length === 0 ? (
                  <p className="empty-state-small">Sem eventos</p>
                ) : (
                  <div className="week-events-list">
                    {dayEvents.map((event) => {
                      const categoriaInfo = getCategoriaInfo(event.categoria);
                      return (
                        <div
                          key={event.id}
                          className={`week-event-item ${event.concluido ? 'completed' : ''}`}
                          style={{ borderLeftColor: categoriaInfo.color }}
                        >
                          <div className="week-event-time">{event.hora}</div>
                          <div className="week-event-content">
                            <span className="week-event-title">{event.titulo}</span>
                            <span
                              className="week-event-category"
                              style={{ color: categoriaInfo.color }}
                            >
                              {categoriaInfo.label.split(' ')[1]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button
                  className="btn-add-to-day"
                  onClick={() => {
                    setSelectedDate(day.date);
                    resetForm();
                    setIsModalOpen(true);
                  }}
                >
                  + Adicionar
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingEvent ? 'Editar Evento' : 'Novo Evento'}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Título do Evento:</label>
            <input
              type="text"
              value={newEvent.titulo}
              onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
              placeholder="Ex: Reunião com equipe"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Data:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hora:</label>
              <input
                type="time"
                value={newEvent.hora}
                onChange={(e) => setNewEvent({ ...newEvent, hora: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Categoria:</label>
              <select
                value={newEvent.categoria}
                onChange={(e) => setNewEvent({ ...newEvent, categoria: e.target.value })}
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
            <label>Descrição (opcional):</label>
            <textarea
              value={newEvent.descricao}
              onChange={(e) => setNewEvent({ ...newEvent, descricao: e.target.value })}
              placeholder="Adicione detalhes sobre o evento..."
              className="form-textarea"
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleAddEvent}>
              {editingEvent ? 'Salvar Alterações' : 'Adicionar Evento'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Templates de Cronograma"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Salvar eventos atuais como template:</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Ex: Rotina de Segunda"
              className="form-input"
            />
            <button
              className="btn-primary"
              onClick={handleSaveTemplate}
              style={{ marginTop: '0.5rem' }}
            >
              💾 Salvar Template
            </button>
          </div>

          <div className="templates-divider"></div>

          <div className="form-group">
            <label>Templates salvos:</label>
            {templates.length === 0 ? (
              <p className="empty-state-small">Nenhum template salvo ainda</p>
            ) : (
              <div className="templates-list">
                {templates.map((template) => (
                  <div key={template.id} className="template-item">
                    <div className="template-info">
                      <span className="template-name">{template.nome}</span>
                      <span className="template-count">
                        {template.eventos.length} eventos
                      </span>
                    </div>
                    <div className="template-actions">
                      <button
                        className="btn-load-template"
                        onClick={() => handleLoadTemplate(template.id)}
                      >
                        📥 Carregar
                      </button>
                      <button
                        className="btn-delete-template"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

