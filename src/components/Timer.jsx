import { useState } from 'react';
import './Timer.css';

export default function Timer({ timer, onStart, onPause, onResume, onStop, onCategoryChange }) {
  const [selectedCategory, setSelectedCategory] = useState('estudo');
  const [customMinutes, setCustomMinutes] = useState(25);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  const handleStart = () => {
    const seconds = customMinutes * 60;
    if (onStart) onStart(seconds, selectedCategory);
  };

  const presetTimes = [
    { label: '15min', minutes: 15 },
    { label: '25min', minutes: 25 },
    { label: '45min', minutes: 45 },
    { label: '60min', minutes: 60 },
  ];

  return (
    <div className="timer-container">
      {!timer.isRunning ? (
        <div className="timer-setup">
          <div className="timer-categories">
            <button
              className={`timer-category ${selectedCategory === 'estudo' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('estudo')}
            >
              📚 Estudo
            </button>
            <button
              className={`timer-category ${selectedCategory === 'trabalho' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('trabalho')}
            >
              💼 Trabalho
            </button>
            <button
              className={`timer-category ${selectedCategory === 'treino' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('treino')}
            >
              🏋️ Treino
            </button>
          </div>

          <div className="timer-presets">
            {presetTimes.map((preset) => (
              <button
                key={preset.minutes}
                className={`timer-preset ${customMinutes === preset.minutes ? 'active' : ''}`}
                onClick={() => setCustomMinutes(preset.minutes)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="timer-custom">
            <label>Tempo personalizado (minutos):</label>
            <input
              type="number"
              min="1"
              max="120"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="timer-input"
            />
          </div>

          <button className="timer-start-btn" onClick={handleStart}>
            ▶️ Iniciar Timer
          </button>
        </div>
      ) : (
        <div className="timer-running">
          <div className="timer-display">
            <div className="timer-time">{timer.formatTime()}</div>
            <div className="timer-category-label">
              {selectedCategory === 'estudo' && '📚 Estudo'}
              {selectedCategory === 'trabalho' && '💼 Trabalho'}
              {selectedCategory === 'treino' && '🏋️ Treino'}
            </div>
          </div>
          <div className="timer-controls">
            {timer.isPaused ? (
              <button className="timer-btn resume" onClick={onResume}>
                ▶️ Continuar
              </button>
            ) : (
              <button className="timer-btn pause" onClick={onPause}>
                ⏸️ Pausar
              </button>
            )}
            <button className="timer-btn stop" onClick={onStop}>
              ⏹️ Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

