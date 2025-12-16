import './ProgressBar.css';

export default function ProgressBar({ value, max = 100, label, showPercentage = true }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

