import React from "react";
import { useNavigate } from "react-router-dom";
import { getSchoolFeeSummary, getPendingFeesByClass, getTopOverdueFamilies, getPendingWaiverRequests } from "../../lib/dataHelpers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { AlertTriangle, TrendingDown, Users, Zap } from "lucide-react";

export default function AdminFeesDashboard() {
  const navigate = useNavigate();
  const summary = getSchoolFeeSummary();
  const pendingByClass = getPendingFeesByClass();
  const topOverdue = getTopOverdueFamilies();
  const pendingWaivers = getPendingWaiverRequests();

  const formatAmount = (amount) => `₹${(amount / 100000).toFixed(1)}L`;
  const formatCrore = (amount) => `₹${(amount / 10000000).toFixed(2)}Cr`;

  // AI Insights
  const insights = [];
  if (summary.overdueAmount > 0) {
    insights.push(`${formatAmount(summary.overdueAmount)} pending from overdue families (${Math.round((summary.overdueAmount / summary.totalPending) * 100)}% of pending)`);
  }
  const maxPendingClass = pendingByClass[0];
  if (maxPendingClass) {
    insights.push(`Class ${maxPendingClass.className} has highest pending: ${formatAmount(maxPendingClass.pending)} (${maxPendingClass.count} students)`);
  }
  if (summary.collectionRate < 90) {
    insights.push(`Collection rate at ${summary.collectionRate}% - ${100 - summary.collectionRate}% below target`);
  }

  // Dummy trend data for chart
  const trendData = [
    { month: "Jul", collected: 35 },
    { month: "Aug", collected: 52 },
    { month: "Sep", collected: 68 },
    { month: "Oct", collected: 75 },
    { month: "Nov", collected: 84 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">💰 School Fee Collection</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Total Expected</p>
          <p className="text-3xl font-bold text-gray-800">{formatCrore(summary.totalExpected)}</p>
          <p className="text-xs text-gray-500 mt-2">Annual target</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-2">Collected</p>
          <p className="text-3xl font-bold text-green-600">{formatCrore(summary.totalCollected)}</p>
          <p className="text-xs text-green-700 mt-2">✓ {summary.collectionRate}% collection rate</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{formatCrore(summary.totalPending)}</p>
          <p className="text-xs text-yellow-700 mt-2">{summary.pendingCount} students owing</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-600 mb-2">Overdue</p>
          <p className="text-3xl font-bold text-red-600">{formatAmount(summary.overdueAmount)}</p>
          <p className="text-xs text-red-700 mt-2">⚠️ {summary.overdueCount} overdue families</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Charts and Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending by Class Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Pending Fees by Class</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pendingByClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="className" />
                <YAxis />
                <Tooltip formatter={(value) => formatAmount(value)} />
                <Legend />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Collection Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📈 Collection Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} name="Collection %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Insights and Actions */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              🤖 AI Insights
            </h3>
            <div className="space-y-2">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <p key={idx} className="text-sm text-gray-700 p-2 bg-blue-100 rounded border-l-2 border-blue-500">
                    "{insight}"
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-600">All fees on track!</p>
              )}
            </div>
          </div>

          {/* Pending Waivers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Pending Waivers</h3>
            <p className="text-3xl font-bold text-orange-600">{pendingWaivers.length}</p>
            <p className="text-sm text-gray-600 mt-2">Waiver requests awaiting approval</p>
            {pendingWaivers.length > 0 && (
              <button
                onClick={() => navigate("/admin/waiver-approvals")}
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Review Requests
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Overdue Families */}
      {topOverdue.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            ⚠️ Top Overdue Families
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Parent Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Students</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Due</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Days Overdue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {topOverdue.map((family, idx) => (
                  <tr key={idx} className={`border-b hover:bg-red-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{family.parentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{family.parentPhone}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                        {family.students.join(", ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">{formatAmount(family.totalDue)}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                        {family.daysPastDue} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => alert("Send reminder to: " + family.parentPhone)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Send Reminder →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border-2 border-blue-200">
          <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
          <p className="text-xs text-gray-600">Fully Paid</p>
          <p className="text-2xl font-bold text-blue-600">{Math.round((summary.totalCollected / summary.totalExpected) * 100)}%</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center border-2 border-yellow-200">
          <TrendingDown className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
          <p className="text-xs text-gray-600">Pending Payment</p>
          <p className="text-2xl font-bold text-yellow-600">{summary.pendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center border-2 border-red-200">
          <AlertTriangle className="w-6 h-6 mx-auto text-red-600 mb-2" />
          <p className="text-xs text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{summary.overdueCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border-2 border-green-200">
          <Zap className="w-6 h-6 mx-auto text-green-600 mb-2" />
          <p className="text-xs text-gray-600">Late Fees</p>
          <p className="text-2xl font-bold text-green-600">{formatAmount(summary.totalLateFees)}</p>
        </div>
      </div>
    </div>
  );
}
