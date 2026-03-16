import { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "./StatCard.jsx";
import SavingsChart from "./SavingsChart.jsx";
import CompletionPieChart from "./CompletionPieChart.jsx";
import DrawHistoryChart from "./DrawHistoryChart.jsx";

function StatsLayout() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats/get-current");
        const json = await response.json();

        if (json.history) {
          // 1. Raggruppiamo i valori per data
          const groupedMap = json.history?.reduce((acc, item) => {
            // Creiamo l'oggetto data in modo sicuro
            const dateObj = new Date(item.date);
            const formattedDate = isNaN(dateObj.getTime())
              ? "N.D."
              : dateObj.toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                });

            if (!acc[formattedDate]) {
              acc[formattedDate] = 0;
            }
            acc[formattedDate] += item.value;
            return acc;
          }, {});

          // 2. Trasformiamo l'oggetto raggruppato in un array e calcoliamo il totale cumulativo
          let cumulative = 0;
          const chartData = Object.keys(groupedMap).map((date) => {
            const dayAmount = groupedMap[date];
            cumulative += dayAmount;

            return {
              date: date,
              amount: dayAmount, // Somma dei sorteggi del giorno
              total: cumulative, // Totale storico fino a quel giorno
            };
          });

          setUserData({ ...json, chartData });
        }

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

      {/* 1. CARDS (Sempre visibili a tutti) */}
      <div className="stats-grid three-columns">
        <StatCard
          title="Totale Risparmiato"
          value={userData.summary.totalSaved}
          unit={userData.currency}
          color="counter"
        />
        <StatCard
          title="Progresso Sfida"
          value={userData.summary.progressPercentage}
          unit="%"
          color="mean"
        />
        <StatCard
          title="Buste Completate"
          value={userData.summary.envelopesCompleted}
          unit={`/ ${userData.summary.totalEnvelopes}`}
          color="streak"
        />
      </div>

      {/* 2. AREA GRAFICI (Condizionale) */}
      <div className="charts-main-grid">
        {/* Il Grafico dei risparmi è la nostra "Premium Feature" */}
        <div
          className={`area-chart-section ${!user?.isPremium ? "chart-container locked-feature" : ""}`}
        >
          <SavingsChart data={userData.chartData} />

          {!user?.isPremium && (
            <div className="premium-overlay">
              <span>🔒 Funzione Premium</span>
              <p>Visualizza l'andamento dei tuoi risparmi nel tempo</p>
              <button className="upgrade-btn">Scopri Premium</button>
            </div>
          )}
        </div>
        {/* Il Grafico dei risparmi è la nostra "Premium Feature" */}
        <div
          className={`area-chart-section ${!user?.isPremium ? "chart-container locked-feature" : ""}`}
        >
          <DrawHistoryChart data={userData.chartData} />
          {!user?.isPremium && (
            <div className="premium-overlay">
              <span>🔒 Funzione Premium</span>
              <p>Visualizza l'andamento dei tuoi risparmi nel tempo</p>
              <button className="upgrade-btn">Scopri Premium</button>
            </div>
          )}
        </div>

        {/* Il grafico a torta del progresso può restare visibile (o essere limitato anche lui) */}
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
