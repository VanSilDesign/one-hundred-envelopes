import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SavingsChart = ({ data }) => (
  <div className="chart-container">
    <h3>Andamento nel tempo</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" minTickGap={30} />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SavingsChart;
