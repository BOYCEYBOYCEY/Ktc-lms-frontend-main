import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentHistory } from "../../data/paymentHistory";
import { students } from "../../data/students";
import { ArrowLeft, Download, CheckCircle } from "lucide-react";

export default function PaymentHistory() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const student = students.find(s => s.id === parseInt(studentId));
  const payments = paymentHistory[studentId] || [];

  if (!student) {
    return <div className="p-6">Loading...</div>;
  }

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const getMethodIcon = (method) => {
    if (method === "UPI") return "📱";
    if (method === "Net Banking") return "🏦";
    if (method === "Card") return "💳";
    return "💰";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-600">{student.name} • Class {student.class}</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Payments</p>
          <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-3xl font-bold text-green-600">{formatAmount(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Last Payment</p>
          <p className="text-lg font-bold text-gray-800">
            {payments.length > 0
              ? new Date(payments[payments.length - 1].paymentDate).toLocaleDateString("en-IN")
              : "No payments yet"
            }
          </p>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Term</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={payment.id} className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(payment.paymentDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {payment.term}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <span className="font-semibold">
                      {getMethodIcon(payment.method)} {payment.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {formatAmount(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono text-xs">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-semibold">Success</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(`Download Receipt: ${payment.receiptId}`)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No payment history yet</p>
          <p className="text-gray-500 text-sm mt-2">Payments will appear here once made</p>
        </div>
      )}

      {/* Summary Box */}
      {payments.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Payment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatAmount(totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Avg Payment</p>
              <p className="text-2xl font-bold text-blue-600">{formatAmount(totalPaid / payments.length)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Payment Method</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                {payments.reduce((acc, p) => {
                  acc[p.method] = (acc[p.method] || 0) + 1;
                  return acc;
                }, {})[payments[0].method]} via {payments[payments.length - 1].method}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Last Paid</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                {new Date(payments[payments.length - 1].paymentDate).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
