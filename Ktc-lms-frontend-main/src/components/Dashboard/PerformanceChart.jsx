import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { AlertCircle } from "lucide-react";

export default function PerformanceChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Average Class Performance
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          8-week trend analysis showing marks % across classes
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="week"
            stroke="#9ca3af"
            style={{ fontSize: "12px", fontWeight: 500 }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#9ca3af"
            label={{
              value: "Marks %",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: "12px", fill: "#6b7280" },
            }}
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
              fontSize: "12px",
            }}
            formatter={(value) => `${Math.round(value)}%`}
            labelStyle={{ color: "#f3f4f6" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" height={30} />

          {/* Lines */}
          <Line
            type="monotone"
            dataKey="8-A"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="8-B"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ fill: "#f97316", r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="9-A"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: "#22c55e", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Alert Box */}
      <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700">
            ⚠️ Intervention Required
          </p>
          <p className="text-xs text-red-600 mt-1">
            Class 8-A and 8-B show 20% decline over 8 weeks. Recommend immediate support.
          </p>
        </div>
      </div>
    </div>
  );
}
