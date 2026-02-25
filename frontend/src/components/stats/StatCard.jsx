// components/stats/StatCard.jsx
const StatCard = ({ title, value, unit, color }) => {
  return (
    <div className="stats-card" style={{ borderLeft: `5px solid ${color || '#8884d8'}` }}>
      <span className="stats-title">{title}</span>
      <div className="stats-value">
        <strong>{value}</strong> <small>{unit}</small>
      </div>
    </div>
  );
};

export default StatCard;