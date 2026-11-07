import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Class Performance Trend (Last 4 Weeks)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="8-A"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="8-B"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="9-A"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
