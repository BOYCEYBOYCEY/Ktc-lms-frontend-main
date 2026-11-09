import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function PaymentTimeline({ fees, plan }) {
  const paymentTerms = plan === "quarterly" ? 4 : plan === "halfYearly" ? 2 : 1;
  const paymentLabels = {
    1: ["Full Year"],
    2: ["First Half", "Second Half"],
    4: ["Q1 (Apr-Jun)", "Q2 (Jul-Sep)", "Q3 (Oct-Dec)", "Q4 (Jan-Mar)"],
  };

  const labels = paymentLabels[paymentTerms];
  const termsPaid = fees.termsPaid || 0;
  const dueDate = new Date(fees.dueDate);
  const today = new Date();
  const isOverdue = today > dueDate;

  const formatDate = (date) => date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📅 Payment Timeline</h3>
        <p className="text-sm text-gray-600">Track your payment schedule for the academic year</p>
      </div>

      <div className="space-y-4">
        {labels.map((label, idx) => {
          const isPaid = idx < termsPaid;
          const isCurrentDue = idx === termsPaid;
          const status = isPaid ? "paid" : isCurrentDue ? "due" : "upcoming";

          return (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                {/* Timeline dot */}
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isPaid ? "bg-green-500 border-green-500" :
                  isCurrentDue && isOverdue ? "bg-red-500 border-red-500" :
                  isCurrentDue ? "bg-blue-500 border-blue-500" :
                  "bg-gray-300 border-gray-300"
                }`}>
                  {isPaid && <span className="text-white text-xs">✓</span>}
                </div>

                {/* Vertical line */}
                {idx < labels.length - 1 && (
                  <div className={`w-0.5 h-16 mt-2 ${
                    isPaid ? "bg-green-500" :
                    isCurrentDue && isOverdue ? "bg-red-500" :
                    isCurrentDue ? "bg-blue-500" :
                    "bg-gray-300"
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{label}</p>
                    {isPaid && <p className="text-xs text-green-600 font-medium">✓ Paid</p>}
                    {isCurrentDue && isOverdue && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))} days overdue
                      </p>
                    )}
                    {isCurrentDue && !isPaid && !isOverdue && (
                      <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due in {Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))} days
                      </p>
                    )}
                    {!isPaid && !isCurrentDue && (
                      <p className="text-xs text-gray-500">Upcoming</p>
                    )}
                  </div>
                  <div className="text-right">
                    {isPaid && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {isCurrentDue && isOverdue && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {isCurrentDue && !isPaid && !isOverdue && <Clock className="w-5 h-5 text-blue-500" />}
                  </div>
                </div>

                {/* Status bar */}
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${
                    isPaid ? "bg-green-500" :
                    isCurrentDue && isOverdue ? "bg-red-500" :
                    isCurrentDue ? "bg-blue-500" :
                    "bg-gray-400"
                  }`} style={{ width: isPaid ? "100%" : "0%" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{termsPaid}</p>
            <p className="text-xs text-gray-600">Payments Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{paymentTerms - termsPaid}</p>
            <p className="text-xs text-gray-600">Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{Math.round((termsPaid / paymentTerms) * 100)}%</p>
            <p className="text-xs text-gray-600">Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
