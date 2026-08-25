import { useState } from "react";
import EnvelopeCounter from "./EnvelopeCounter.jsx";
import IconButton from "../UI/IconButton.jsx";
import SuccessModal from "../modals/SuccesModal.jsx";

function EnvelopesContainer({
  user,
  amounts,
  onSaveSuccess,
  currency,
  challengeTitle,
}) {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [lastAmount, setLastAmount] = useState(0); // <--- AGGIUNGI QUESTO

  const handleChoose = () => {
    let availableEnvelopes = [];
    if (!user) {
      availableEnvelopes = Array.from({ length: 100 }, (_, i) => ({
        value: i + 1,
      }));
    } else {
      availableEnvelopes = amounts.filter((env) => !env.isOpened);
      if (availableEnvelopes.length === 0) return alert("Sfida completata!");
    }

    const randomIndex = Math.floor(Math.random() * availableEnvelopes.length);
    const selected = availableEnvelopes[randomIndex];

    setSelectedNumber(selected.value); // Il numero che apparirà nel cerchio del tuo mock-up
  };

  const handleSave = async () => {
    if (!selectedNumber) return;

    setIsSaving(true);
    try {
      // Qui chiameremo la rotta PATCH che aggiorna 'isOpened' nel DB
      const response = await fetch(`/api/numbers/save-number`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: selectedNumber }),
        credentials: "include",
      });

      if (response.ok) {
        setLastAmount(selectedNumber);
        setShowModal(true);
        onSaveSuccess(); // Notifica la Dashboard di ricaricare i dati (i quadratini cambieranno colore!)
        setSelectedNumber(0); // Reset counter
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="envelopes-container">
      <SuccessModal
        isOpen={showModal}
        amount={lastAmount}
        challengeName={challengeTitle || "la tua sfida"}
        onClose={() => setShowModal(false)}
      />
      {!user && (
        <div>
          <h2>Pesca un numero da 1 a 100</h2>
          <p>Puoi estrarre un numero casuale da 1 a 100 fin da subito.</p>
        </div>
      )}
      {user && <h2>Scegli la tua busta ({currency || "€"})</h2>}
      <EnvelopeCounter count={selectedNumber} />
      <div className="envelopes-button">
        <IconButton onClick={handleChoose} disabled={isSaving}>
          Pesca
        </IconButton>
        {user && (
          <IconButton
            onClick={() => handleSave(selectedNumber)}
            disabled={selectedNumber === 0}
            title={!isSaving ? "Salvataggio in corso..." : "Salva"}
          >
            {isSaving ? "Salvataggio in corso..." : "Salva"}
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default EnvelopesContainer;
