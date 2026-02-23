import { useEffect, useState } from "react";
import calculateSavings from "../util/calc.js";
import Input from "./UI/Input";

export default function Settings() {
  const [settingValues, setSettingValues] = useState({
    maxEnvelopeValue: 100,
    step: 1,
    numberOfEnvelopes: 100,
    currency: "€",
  });

  const [summary, setSummary] = useState({
    total: 0,
    isValidSetting: true,
    error: "",
  });

  // Caricamento dati se già modificati
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings/get", {
          //ricordati che ora hai il proxy a il http://localhost:5000!!!
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", //non è strettamente necessario in GET, ma da mettere se ci sono problemi di sessione
        });

        if (response.ok) {
          const data = await response.json();

          if (data && Object.keys(data).length > 0) {
            // Se abbiamo dati, aggiorniamo lo stato
            setSettingValues(data);
          }
        }
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      }
    };

    loadSettings();
  }, []); // <--- Array vuoto: si esegue solo al caricamento!

  // Modifico dati
  useEffect(() => {
    const result = calculateSavings(
      settingValues.maxEnvelopeValue,
      settingValues.step,
      settingValues.numberOfEnvelopes,
    );

    // Passiamo tutto l'oggetto result allo stato summary
    setSummary(result);
  }, [settingValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingValues((prev) => ({
      ...prev,
      [name]: name === "currency" ? value : Number(value),
    }));
  };

  // Se ho modificato almeno uno dei due dati calcolo il terzo
  useEffect(() => {
    const max = Number(settingValues.maxEnvelopeValue);
    const st = Number(settingValues.step);

    // Calcoliamo il numero di buste solo se i valori sono validi
    if (max > 0 && st > 0) {
      const calculatedEnvelopes = Math.floor(max / st);

      // Aggiorniamo lo stato solo se il valore è diverso per evitare loop infiniti
      if (calculatedEnvelopes !== settingValues.numberOfEnvelopes) {
        setSettingValues((prev) => ({
          ...prev,
          numberOfEnvelopes: calculatedEnvelopes,
        }));
      }
    }
  }, [settingValues.maxEnvelopeValue, settingValues.step]); // Si attiva quando cambiano questi due

  const handleSave = async (e) => {
    e.preventDefault(); // Impedisce il ricaricamento della pagina

    if (!summary.isValidSetting) return; // Doppia sicurezza

    try {
      const response = await fetch("/api/settings/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingValues),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        alert("Impostazioni salvate con successo!");
        // Magari qui reindirizziamo alla home o mostriamo un messaggio di successo (vediamo)
      } else {
        alert("Errore nel salvataggio: " + data.message);
      }
    } catch (error) {
      console.error("Errore durante la fetch:", error);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h2>Game Settings</h2>
      <Input
        label="Valore Massimo Busta (€):"
        id="maxEnvelopeValue"
        type="number"
        name="maxEnvelopeValue"
        value={settingValues.maxEnvelopeValue}
        onChange={handleChange}
      />
      <Input
        label="Passo / Incremento (€):"
        id="step"
        type="number"
        name="step"
        value={settingValues.step}
        onChange={handleChange}
      />
      <Input
        label="Numero Totale Buste:"
        id="numberOfEnvelopes"
        type="number"
        name="numberOfEnvelopes"
        value={settingValues.numberOfEnvelopes}
        onChange={handleChange}
      />
      <div className="control no-margin">
        <label htmlFor="currency">Valuta</label>
        <select
          id="currency"
          name="currency"
          value={settingValues.currency}
          onChange={handleChange}
        >
          <option value="€">Euro (€)</option>
          <option value="$">Dollaro ($)</option>
          <option value="£">Sterlina (£)</option>
          <option value="CHF">Franco Svizzero (CHF)</option>
        </select>
      </div>

      <div className="summary-section">
        <p>
          <strong>Totale risparmio:</strong> {summary.total.toLocaleString()} €
        </p>
        <p className="warning-text">
          {summary.error && <span>⚠️ {summary.error}</span>}
        </p>
      </div>

      <button className="button" disabled={!summary?.isValidSetting}>
        Salva Impostazioni
      </button>
    </form>
  );
}
