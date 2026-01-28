import { saveSelectedNumber } from "../../http.js";

import { useState, useCallback } from "react";

import EnvelopeCounter from "./EnvelopeCounter.jsx";
import IconButton from "../UI/IconButton.jsx";

function EnvelopesContainer({ onSaveSuccess }) {
  const [count, setCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleChoose = useCallback(function handleChoose() {
    setCount(Math.floor(Math.random() * 100) + 1);
  }, []);

  async function handleSave(selectedNumber) {
    if (selectedNumber === 0) return;

    setIsSaving(true);
    try {
      await saveSelectedNumber(selectedNumber);
      if (onSaveSuccess) onSaveSuccess();
      alert("Numero Salvato");
      setCount(0);
    } catch (error) {
      alert(error.message || "Impossibile eseguire il salvataggio.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div id="envelopes-container">
      <h2>Choose your envelope</h2>
      <EnvelopeCounter count={count} />
      <div className="envelopes-button">
        <IconButton onClick={handleChoose}>Choose</IconButton>
        <IconButton
          onClick={() => handleSave(count)}>
          {isSaving ? "Saving..." : "Save"}
        </IconButton>
      </div>
    </div>
  );
}

export default EnvelopesContainer;
