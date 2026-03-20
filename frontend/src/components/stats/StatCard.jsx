// components/stats/StatCard.jsx
const StatCard = ({ title, value, unit, color }) => {
  return (
    <div className={`stats-card stats-${color}`}>
      <span className="stats-title">{title}</span>
      <div className={`stats-value stats-${color}`}>
        <strong>{value}</strong> <small>{unit}</small>
      </div>
    </div>
  );
};

export default StatCard;