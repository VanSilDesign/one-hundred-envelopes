import EnvelopeNumbers from "./EnvelopeNumbers";

function EnvelopesHistory() {
  return (
    <div id="envelopes-history">
      <EnvelopeNumbers
        title="Envelopes History"
        numbers={availableNumbers}
        isLoading={isFetching}
        loadingText="Fetching numbers data..."
        fallbackText="No numbers available."
        onSelectNumber={onSelectNumber}
      />
    </div>
  );
}

export default EnvelopesHistory;
