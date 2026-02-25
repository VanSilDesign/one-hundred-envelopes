import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CompletionPieChart = ({ completed, total }) => {
  // Prepariamo i dati includendo già il colore (fill) per ogni fetta
  const data = [
    { name: "Completate", value: completed, fill: "#4caf50" },
    { name: "Rimanenti", value: total - completed, fill: "#e0e0e0" },
  ];

  return (
    <div className="chart-container pie-wrapper">
      <h3>Stato della Sfida</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" // Centro X
            cy="50%" // Centro Y
            innerRadius={60} // Raggio interno (la rende una ciambella/donut)
            outerRadius={80} // Raggio esterno
            paddingAngle={5}
            dataKey="value"
          />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionPieChart;