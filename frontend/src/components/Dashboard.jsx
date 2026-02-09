// components/Dashboard.jsx
export default function Dashboard({ 
  numbers, isFetching, onStartRemoveNumber, onStartResetHistory, loadNumbers 
}) {
  return (
    <>
      <EnvelopesContainer onSaveSuccess={loadNumbers} />
        {/* Passiamo lo stato di caricamento alla storia */}
      <EnvelopesHistory
        numbers={numbers}
        isLoading={isFetching}
        onDeleteNumber={onStartRemoveNumber}
        onResetHistory={onStartResetHistory}
      />
    </>
  );
}