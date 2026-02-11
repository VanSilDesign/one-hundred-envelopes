import EnvelopeNumbers from "./EnvelopeNumbers";

function EnvelopesHistory({numbers, isFetching, onDeleteNumber, onResetHistory}) {
  return (
    <div id="envelopes-history">
      {numbers && <EnvelopeNumbers
        title="Envelopes History"
        numbers={numbers}
        isLoading={isFetching}
        loadingText="Fetching numbers data..."
        fallbackText="No numbers available."
        onDeleteNumber={onDeleteNumber}
        onResetHistory={onResetHistory}
      />}
      {!numbers && <p>Scegli un numero!</p>}
    </div>
  );
}

export default EnvelopesHistory;
