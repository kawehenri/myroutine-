import './Card.css';

export default function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

