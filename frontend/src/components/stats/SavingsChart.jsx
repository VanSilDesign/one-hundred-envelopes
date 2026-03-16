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
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#cd8660" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#cd8660" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" minTickGap={30} />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#cd8660"
          fill="url(#colorTotal)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SavingsChart;
