import { useState } from 'react';
import { getDateKey } from '../utils/dateHelpers';
import './Calendario.css';

export default function Calendario({ allData, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDayData = (day) => {
    const dateKey = getDateKey(new Date(year, month, day));
    return allData[dateKey];
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleDayClick = (day) => {
    const dateKey = getDateKey(new Date(year, month, day));
    if (onDateSelect) {
      onDateSelect(dateKey);
    }
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayData = getDayData(day);
    const hasData = dayData && Object.keys(dayData).length > 0;
    const hasEvents = dayData?.cronograma && dayData.cronograma.length > 0;
    const hasTreino = dayData?.treino?.feito;
    const hasEstudo = dayData?.estudo?.concluido;

    days.push(
      <div
        key={day}
        className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasData ? 'has-data' : ''}`}
        onClick={() => handleDayClick(day)}
      >
        <div className="day-number">{day}</div>
        <div className="day-indicators">
          {hasEvents && <span className="indicator" title="Eventos">📅</span>}
          {hasEstudo && <span className="indicator" title="Estudo">📚</span>}
          {hasTreino && <span className="indicator" title="Treino">🏋️</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <button className="calendario-nav-btn" onClick={previousMonth}>←</button>
        <h3 className="calendario-title">{monthNames[month]} {year}</h3>
        <button className="calendario-nav-btn" onClick={nextMonth}>→</button>
      </div>
      <button className="btn-today" onClick={goToToday}>Hoje</button>
      <div className="calendario-weekdays">
        <div className="weekday">Dom</div>
        <div className="weekday">Seg</div>
        <div className="weekday">Ter</div>
        <div className="weekday">Qua</div>
        <div className="weekday">Qui</div>
        <div className="weekday">Sex</div>
        <div className="weekday">Sáb</div>
      </div>
      <div className="calendario-days">{days}</div>
    </div>
  );
}

