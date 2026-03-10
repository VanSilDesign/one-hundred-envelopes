import { useState } from "react";
import EnvelopeCounter from "./EnvelopeCounter.jsx";
import IconButton from "../UI/IconButton.jsx";

function EnvelopesContainer({ user, amounts, onSaveSuccess, currency }) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(0);

  /* const handleChoose = useCallback(
    function handleChoose() {
      const maxVal = settingValues.maxEnvelopeValue;
      const step = settingValues.step;
      const numEnvelopes = Math.floor(maxVal / step);

      if (chosenEnvelopes.size >= numEnvelopes) {
        alert("Hai estratto tutte le buste");
        return;
      }

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * numEnvelopes) + 1;
      } while (chosenEnvelopes.has(randomIndex));
      
      const sortedValue = randomIndex * step;

      setCount(sortedValue);
    },
    [chosenEnvelopes, settingValues],
  ); */

  const handleChoose = () => {
    const availableEnvelopes = amounts.filter((env) => !env.isOpened);
    if (availableEnvelopes.length === 0) return alert("Sfida completata!");

    const randomIndex = Math.floor(Math.random() * availableEnvelopes.length);
    const selected = availableEnvelopes[randomIndex];

    setSelectedNumber(selected.value); // Il numero che apparirà nel cerchio del tuo mock-up
  };

  const handleSave = async () => {
    if (!selectedNumber) return;
    
    setIsSaving(true);
    try {
      // Qui chiameremo la rotta PATCH che aggiorna 'isOpened' nel DB
      const response = await fetch(`/api/challenge/open-envelope`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: selectedNumber }),
        credentials: "include",
      });

      if (response.ok) {
        setSelectedNumber(null); // Reset del cerchio centrale
        onSaveSuccess(); // Notifica la Dashboard di ricaricare i dati (i quadratini cambieranno colore!)
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="envelopes-container">
      <h2>Scegli la tua busta ({currency})</h2>
      <EnvelopeCounter count={selectedNumber} />
      <div className="envelopes-button">
        <IconButton onClick={handleChoose}>Scegli</IconButton>
        <IconButton
          onClick={() => handleSave(selectedNumber)}
          disabled={!user || selectedNumber === 0 || isLoading} // IL BOTTONE SI DISABILITA SE USER È NULL
          title={!user ? "Accedi per salvare" : ""}
        >
          {isSaving ? "Salvataggio in corso..." : "Salva"}
        </IconButton>
      </div>
    </div>
  );
}

export default EnvelopesContainer;
