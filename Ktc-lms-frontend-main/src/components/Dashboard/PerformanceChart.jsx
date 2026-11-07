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
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Average Marks Trend
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Class-wise performance over last 4 weeks (lower trend = intervention needed)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis
            domain={[0, 100]}
            label={{ value: "Marks %", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="8-A"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="8-B"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="9-A"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
        <p className="text-xs text-red-700">
          <span className="font-semibold">⚠️ Alert:</span> Class 8-A and 8-B show declining marks. Recommend intervention by week 5.
        </p>
      </div>
    </div>
  );
}
