import EnvelopesHistory from "./envelopes/EnvelopeHistory";

export default function DashboardPage({
  numbers,
  isLoading,
  onDeleteNumber,
  onResetHistory,
}) {
  return (
    <div className="dashboard-container">
      <h1>La mia Dashboard</h1>
      <p>Benvenuto nella tua area riservata.</p>
      
      <EnvelopesHistory
        numbers={numbers}
        isLoading={isLoading}
        onDeleteNumber={onDeleteNumber}
        onResetHistory={onResetHistory}
      />
    </div>
  );
}
