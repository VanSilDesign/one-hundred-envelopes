import { saveSelectedNumber } from "../../http.js";
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext.jsx";
import EnvelopeCounter from "./EnvelopeCounter.jsx";
import IconButton from "../UI/IconButton.jsx";

function EnvelopesContainer({ onSaveSuccess }) {
  const { user } = useAuth();
  const { settingValues, isLoading } = useSettings();
  const [count, setCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [chosenEnvelopes, setChosenEnvelopes] = useState(new Set());

  const handleChoose = useCallback(
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
  );

  async function handleSave(selectedNumber) {
    if (selectedNumber === 0) return;

    setIsSaving(true);
    try {
      await saveSelectedNumber(selectedNumber);
      setChosenEnvelopes((prevEnv) => new Set(prevEnv).add(selectedNumber));
      if (onSaveSuccess) onSaveSuccess();
      alert("Numero Salvato");
      setCount(0);
    } catch (error) {
      alert(error.message || "Impossibile eseguire il salvataggio.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !settingValues) {
    return (
      <div id="envelopes-container" className="loading-state">
        <h2>Loading settings...</h2>
      </div>
    );
  }

  return (
    <div id="envelopes-container">
      <h2>Choose your envelope ({settingValues.currency})</h2>
      <EnvelopeCounter count={count} />
      <div className="envelopes-button">
        <IconButton onClick={handleChoose}>Choose</IconButton>
        <IconButton
          onClick={() => handleSave(count)}
          disabled={!user || count === 0 || isLoading} // IL BOTTONE SI DISABILITA SE USER È NULL
          title={!user ? "Login to save" : ""}
        >
          {isSaving ? "Saving..." : "Save"}
        </IconButton>
      </div>
    </div>
  );
}

export default EnvelopesContainer;
