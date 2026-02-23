/**
 * Calcola il totale risparmiato e il numero di buste basandosi
 * sulle impostazioni dell'utente.
 */
export default function calculateSavings(
  maxEnvelopeValue,
  step,
  numberOfEnvelopes,
) {
  // Assicuriamoci che i valori siano numeri
  const max = Number(maxEnvelopeValue);
  const st = Number(step);
  const num = Number(numberOfEnvelopes);

  // --- VALIDAZIONE INPUT DI BASE ---
  if (max <= 0 || st <= 0 || num <= 0) {
    return { 
      total: 0,
      isValidSetting: false,
      error: "Tutti i valori devono essere maggiori di zero.",
    };
  }

  // --- VALIDAZIONE COERENZA DEI DATI ---
  // Il numero di buste * il passo deve uguale al valore massimo
  const isValidNumberOfEnvelopes = num * st === max;

  if (!isValidNumberOfEnvelopes) {
    return { 
      total: 0,
      isValidSetting: false,
      error:
        "Attenzione: Il numero di buste per il passo scelto non corrisponde al valore massimo.",
    };
  }

  // --- CALCOLO TOTALE (Progressione di Gauss) ---
  const total = (num / 2) * (st + num * st);
  
  return { 
    total: total,
    isValidSetting: true,
    error: "",
  };
}