import "./EnvelopesGridDisplay.css"; // Creeremo questo file tra un secondo

export default function EnvelopesGridDisplay({ amounts, currency }) {
  if (!amounts || amounts.length === 0) return <p>Nessuna busta generata.</p>;

  return (
    <div className="history-grid-container">
      <div className="envelopes-grid">
        {amounts.map((envelope) => (
          <div
            key={envelope._id.$oid || envelope._id}
            className={`envelope-box ${envelope.isOpened ? "opened" : "closed"}`}
          >
            <span className="envelope-number">{envelope.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}