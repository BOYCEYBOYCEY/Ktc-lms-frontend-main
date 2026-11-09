import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function FeeComparison({ currentFee, lastYearFee }) {
  const difference = currentFee - lastYearFee;
  const percentChange = ((difference / lastYearFee) * 100).toFixed(1);
  const isIncrease = difference > 0;

  const formatAmount = (amount) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">📊 Fee Comparison</h3>
        <p className="text-sm text-gray-600">Academic Year 2025-26 vs 2024-25</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Last Year */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Last Year (2024-25)</p>
          <p className="text-2xl font-bold text-gray-700">{formatAmount(lastYearFee)}</p>
        </div>

        {/* Current Year */}
        <div className={`rounded-lg p-4 border-2 ${isIncrease ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-xs ${isIncrease ? "text-blue-600" : "text-green-600"} mb-1 font-medium`}>
            This Year (2025-26)
          </p>
          <p className={`text-2xl font-bold ${isIncrease ? "text-blue-700" : "text-green-700"}`}>
            {formatAmount(currentFee)}
          </p>
        </div>
      </div>

      {/* Change Info */}
      <div className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
        isIncrease
          ? "bg-blue-50 border-blue-400"
          : "bg-green-50 border-green-400"
      }`}>
        <div className="pt-1">
          {isIncrease ? (
            <TrendingUp className="w-5 h-5 text-blue-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${isIncrease ? "text-blue-800" : "text-green-800"}`}>
            {isIncrease ? "Fee Increase" : "Fee Decrease"}
          </p>
          <p className={`text-sm mt-1 ${isIncrease ? "text-blue-700" : "text-green-700"}`}>
            {isIncrease ? "+" : ""}{formatAmount(Math.abs(difference))} ({percentChange}%)
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {isIncrease
              ? "Annual fee has increased due to inflation and improved facilities."
              : "Annual fee has been reduced due to optimization."}
          </p>
        </div>
      </div>

      {/* Fee Breakdown Comparison */}
      <div className="pt-4 border-t space-y-3">
        <p className="text-sm font-semibold text-gray-700">Breakdown (Annual)</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Tuition</span>
            <span className="flex gap-2">
              <span className="text-gray-500 line-through text-xs">{formatAmount(42000)}</span>
              <span className="font-semibold text-gray-800">{formatAmount(46000)}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Books & Materials</span>
            <span className="flex gap-2">
              <span className="text-gray-500 line-through text-xs">{formatAmount(3000)}</span>
              <span className="font-semibold text-gray-800">{formatAmount(3500)}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sports & Activities</span>
            <span className="flex gap-2">
              <span className="text-gray-500 line-through text-xs">{formatAmount(2000)}</span>
              <span className="font-semibold text-gray-800">{formatAmount(2000)}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Technology Fee</span>
            <span className="flex gap-2">
              <span className="text-gray-500 line-through text-xs">{formatAmount(1000)}</span>
              <span className="font-semibold text-gray-800">{formatAmount(2000)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Paying in full (Annual plan) gives you a 10% discount regardless of any increase. You save the most!
        </p>
      </div>
    </div>
  );
}
