const calculateAndGenerateEnvelopes = (max, st, num) => {

  // 1. Validazione coerenza (la tua logica)
  if (Number(num) * Number(st) !== Number(max)) {
    throw new Error("I parametri della sfida non sono coerenti.");
  }

  // 2. Calcolo totale (Gauss)
  const totalExpected = (num / 2) * (st + num * st);

  // 3. Generazione array buste
  const envelopes = [];
  for (let i = 1; i <= num; i++) {
    envelopes.push({
      value: i * st, // Es: 1*5=5, 2*5=10, 3*5=15... Oppure ovviamente 1*1=1, 2*1=1, ..., 100*1=100
      active: true,
      isOpened: false,
      note: ""
    });
  }

  return { envelopes, totalExpected };
};

module.exports = { calculateAndGenerateEnvelopes };