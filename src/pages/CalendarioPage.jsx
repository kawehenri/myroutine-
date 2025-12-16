import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDate } from '../utils/dateHelpers';
import Card from '../components/Card';
import Calendario from '../components/Calendario';
import './CalendarioPage.css';

export default function CalendarioPage() {
  const [allData] = useLocalStorage('routineData', {});
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const navigate = useNavigate();

  const selectedData = selectedDateKey ? allData[selectedDateKey] : null;

  const handleDateSelect = (dateKey) => {
    setSelectedDateKey(dateKey);
  };

  const goToCronograma = () => {
    navigate('/cronograma');
  };

  return (
    <div className="calendario-page">
      <div className="page-header">
        <h1>📅 Calendário</h1>
      </div>

      <div className="calendario-page-grid">
        <Card title="Calendário Mensal" icon="📆">
          <Calendario allData={allData} onDateSelect={handleDateSelect} />
        </Card>

        {selectedDateKey && (
          <Card title={`Detalhes - ${formatDate(selectedDateKey)}`} icon="📋">
            {!selectedData || Object.keys(selectedData).length === 0 ? (
              <p className="empty-state">Nenhum dado registrado neste dia</p>
            ) : (
              <div className="day-details">
                {selectedData.cronograma && selectedData.cronograma.length > 0 && (
                  <div className="detail-section">
                    <h4>📅 Eventos ({selectedData.cronograma.length})</h4>
                    <ul className="detail-list">
                      {selectedData.cronograma.slice(0, 3).map((evento) => (
                        <li key={evento.id}>
                          {evento.hora} - {evento.titulo}
                        </li>
                      ))}
                      {selectedData.cronograma.length > 3 && (
                        <li className="more-items">
                          +{selectedData.cronograma.length - 3} mais...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {selectedData.estudo && (
                  <div className="detail-section">
                    <h4>📚 Estudo</h4>
                    <p>
                      {selectedData.estudo.concluido ? '✅ Concluído' : '❌ Não concluído'}
                      {selectedData.estudo.tempoEstudado > 0 && ` - ${selectedData.estudo.tempoEstudado} min`}
                    </p>
                  </div>
                )}

                {selectedData.treino && (
                  <div className="detail-section">
                    <h4>🏋️ Treino</h4>
                    <p>
                      {selectedData.treino.feito ? '✅ Realizado' : '❌ Não realizado'}
                      {selectedData.treino.duracao > 0 && ` - ${selectedData.treino.duracao} min`}
                    </p>
                  </div>
                )}

                {selectedData.sono && selectedData.sono.horas > 0 && (
                  <div className="detail-section">
                    <h4>😴 Sono</h4>
                    <p>{selectedData.sono.horas}h</p>
                  </div>
                )}

                {selectedData.alimentacao && (
                  <div className="detail-section">
                    <h4>🍽️ Refeições</h4>
                    <p>
                      {selectedData.alimentacao.cafe ? '✅ ' : '❌ '}Café da manhã<br />
                      {selectedData.alimentacao.almoco ? '✅ ' : '❌ '}Almoço<br />
                      {selectedData.alimentacao.jantar ? '✅ ' : '❌ '}Jantar
                    </p>
                  </div>
                )}

                {selectedData.notas && (
                  <div className="detail-section">
                    <h4>📝 Notas</h4>
                    <p className="notas-preview">{selectedData.notas}</p>
                  </div>
                )}

                <button className="btn-go-to-day" onClick={goToCronograma}>
                  Ir para Cronograma →
                </button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

