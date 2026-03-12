import "./EnvelopesGridDisplay.css"; // Creeremo questo file tra un secondo

export default function EnvelopesGridDisplay({ amounts, onUpdateSuccess }) {
  const handleCloseEnvelope = async (e, value) => {
    e.stopPropagation(); // Evita che il click sulla X attivi altri eventi sul quadratino
    
    if (window.confirm(`Vuoi annullare il risparmio di ${value}€?`)) {
      try {
        const response = await fetch(`/api/numbers/soft-delete-number/${value}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (response.ok) {
          onUpdateSuccess();
        }
      } catch (error) {
        console.error("Errore nel reset della busta:", error);
      }
    }
  };

  return (
    <div className="history-grid-container">
      <div className="envelopes-grid">
        {amounts.map((env) => (
          <div
            key={env.value}
            className={`envelope-box ${env.isOpened ? "opened" : "closed"}`}
          >
            <span className="number">{env.value}</span>
            
            {/* La X appare solo se la busta è aperta */}
            {env.isOpened && (
              <button 
                className="delete-btn" 
                onClick={(e) => handleCloseEnvelope(e, env.value)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
