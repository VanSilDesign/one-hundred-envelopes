import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DrawHistoryChart = ({ data }) => {
  // Rimuoviamo la mappatura interna drawData se i dati arrivano già pronti dal padre!
  
  return (
    <div className="chart-container">
      <h3>Valore dei Sorteggi</h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* Passiamo direttamente 'data' */}
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} // Un tocco di grigio chiaro al passaggio
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
          {/* USIAMO 'amount' come dataKey, perché è così che l'abbiamo chiamato nell'useEffect */}
          <Bar 
            dataKey="amount" 
            fill="#E8A593" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DrawHistoryChart;