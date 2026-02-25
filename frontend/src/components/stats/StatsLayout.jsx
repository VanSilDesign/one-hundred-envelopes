import { useEffect, useState } from "react";
import StatCard from "./StatCard.jsx";
import SavingsChart from "./SavingsChart.jsx";
import CompletionPieChart  from "./CompletionPieChart.jsx"

function StatsLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats/dashboard");
        const json = await response.json();

        let cumulative = 0;
        const chartData = json.history?.map((item) => {
          cumulative += item.value;
          return {
            date: new Date(item.date).toLocaleDateString(),
            amount: item.value,
            total: cumulative,
          };
        });

        setUserData({ ...json, chartData });
        setLoading(false);
      } catch (error) {
        console.error("Errore fetch:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Caricamento statistiche...</div>;
  if (!userData) return <div>Impossibile caricare le statistiche.</div>;
  return (
    <div className="stats-layout">
      <header className="stats-header">
        <h2>Dashboard Personale</h2>
        <p>Stai facendo un ottimo lavoro con la sfida delle buste!</p>
      </header>

      <div className="stats-grid">
        <StatCard
          title="Totale Risparmiato"
          value={userData.summary.totalSaved}
          unit={userData.currency}
          color="#4caf50"
        />
        <StatCard
          title="Progresso Sfida"
          value={userData.summary.progressPercentage}
          unit="%"
          color="#2196f3"
        />
        <StatCard
          title="Buste Completate"
          value={userData.summary.envelopesCompleted}
          unit={`/ ${userData.summary.totalEnvelopes}`}
          color="#ff9800"
        />
      </div>

      <div className="charts-main-grid">
        {/* Grafico ad Area (più largo) */}
        <div className="area-chart-section">
          <SavingsChart data={userData.chartData} />
        </div>

        {/* Grafico a Torta (più stretto) */}
        <div className="pie-chart-section">
          <CompletionPieChart
            completed={userData.summary.envelopesCompleted}
            total={userData.summary.totalEnvelopes}
          />
        </div>
      </div>
    </div>
  );
}

export default StatsLayout;
