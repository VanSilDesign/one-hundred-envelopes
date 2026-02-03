import EnvelopeNumbers from "./EnvelopeNumbers";

const handleDeleteSingle = async (num) => {
  try {
    const response = await fetch(`http://localhost:5000/api/delete-number/${num}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Importante: aggiorna lo stato locale per far sparire il numero subito
      onUpdate(); // La funzione che ricarica la lista che abbiamo visto l'altra volta
    }
  } catch (err) {
    console.error("Errore nell'eliminazione singola:", err);
  }
};

function EnvelopesHistory({numbers, isFetching, onDeleteNumber, onResetHistory}) {
  return (
    <div id="envelopes-history">
      <EnvelopeNumbers
        title="Envelopes History"
        numbers={numbers}
        isLoading={isFetching}
        loadingText="Fetching numbers data..."
        fallbackText="No numbers available."
        onDeleteNumber={onDeleteNumber}
        onResetHistory={onResetHistory}
      />
    </div>
  );
}

export default EnvelopesHistory;
