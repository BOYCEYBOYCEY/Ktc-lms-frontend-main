import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getParentChildren, getStudentUpcomingFees } from "../../lib/dataHelpers";
import { paymentHistory } from "../../data/paymentHistory";
import { ChevronRight, AlertCircle, Calendar, TrendingUp } from "lucide-react";

export default function ParentHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(null);

  console.log("📍 ParentHome Mounted");
  console.log("👤 User from Auth:", user);

  if (!user) {
    console.error("❌ No user in auth context");
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg">
        <p className="text-red-600 font-bold">Error: User not authenticated</p>
      </div>
    );
  }

  if (!user.parentPhone) {
    console.error("❌ No parentPhone in user object:", user);
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg">
        <p className="text-red-600 font-bold">Error: Parent phone not found</p>
        <p className="text-gray-600 text-sm mt-2">User object: {JSON.stringify(user, null, 2)}</p>
      </div>
    );
  }

  console.log("✅ Parent phone found:", user.parentPhone);

  let children = [];
  let childrenError = null;

  try {
    children = getParentChildren(user.parentPhone);
    console.log("✅ Children retrieved:", children);
  } catch (error) {
    console.error("❌ Error getting children:", error);
    childrenError = error.message;
  }

  React.useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      console.log("✅ Setting first child:", children[0]);
      setSelectedChild(children[0]);
    }
  }, [children, selectedChild]);

  if (childrenError) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg">
        <p className="text-red-600 font-bold">Error loading children data</p>
        <p className="text-gray-600 text-sm mt-2">{childrenError}</p>
      </div>
    );
  }

  if (!selectedChild) {
    return <div className="p-6 text-center text-gray-600">Loading student data...</div>;
  }

  console.log("✅ Selected child:", selectedChild);

  const fees = selectedChild.fees;
  console.log("✅ Fees for child:", fees);

  if (!fees) {
    return (
      <div className="p-6 text-center bg-yellow-50 rounded-lg">
        <p className="text-yellow-600 font-bold">No fee data available for this student</p>
      </div>
    );
  }

  const upcomingFees = getStudentUpcomingFees(selectedChild.id);
  const recentPayments = (paymentHistory[selectedChild.id] || []).slice(-2);

  console.log("✅ All data loaded successfully");

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getStatusColor = (status) => {
    if (status === "paid") return "bg-green-50 border-green-200";
    if (status === "pending") return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusBadgeColor = (status) => {
    if (status === "paid") return "bg-green-100 text-green-800";
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Child Selector */}
      {children.length > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Child
          </label>
          <select
            value={selectedChild.id}
            onChange={(e) => {
              const child = children.find(c => c.id === parseInt(e.target.value));
              setSelectedChild(child);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} (Class {child.class})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fee Summary Card */}
      <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 ${getStatusColor(fees.status)}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">Student</p>
            <p className="text-lg font-bold text-gray-800">{selectedChild.name}</p>
            <p className="text-xs text-gray-500">Class {selectedChild.class} • {selectedChild.admissionNo}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(fees.status)}`}>
            {fees.status.charAt(0).toUpperCase() + fees.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-600">Total Due</p>
            <p className="text-xl font-bold text-gray-800">{formatAmount(fees.discountedTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Paid</p>
            <p className="text-xl font-bold text-green-600">{formatAmount(fees.paidAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Pending</p>
            <p className="text-xl font-bold text-red-600">{formatAmount(fees.pendingAmount + fees.lateFee)}</p>
          </div>
        </div>

        {fees.status !== "paid" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-semibold">Due Date: {new Date(fees.dueDate).toLocaleDateString("en-IN")}</p>
              {fees.lateFee > 0 && <p>Late fee: {formatAmount(fees.lateFee)}</p>}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/parent/fees/${selectedChild.id}`)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            View Details
          </button>
          <button
            onClick={() => navigate(`/parent/fees/${selectedChild.id}`)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Fee Breakdown Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Breakdown</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Tuition Fee</span>
            <span className="font-semibold text-gray-800">{formatAmount(fees.baseFee)}</span>
          </div>
          {fees.addOns.map(addon => (
            <div key={addon} className="flex justify-between">
              <span className="text-gray-600">• {addon}</span>
              <span className="font-semibold text-gray-800">
                +{formatAmount(Math.floor(Math.random() * 3000) + 6000)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Annual Fee</span>
              <span className="font-bold text-gray-800">{formatAmount(fees.totalAnnualFee)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Fees */}
      {upcomingFees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Fees
          </h3>
          <div className="space-y-3">
            {upcomingFees.slice(0, 3).map(fee => (
              <div key={fee.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-800">{fee.icon} {fee.title}</p>
                  <p className="text-xs text-gray-600">{fee.description}</p>
                  <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString("en-IN")}</p>
                </div>
                <span className="font-bold text-blue-600 text-lg">{formatAmount(fee.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {recentPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Recent Payments
          </h3>
          <div className="space-y-3">
            {recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">{payment.term}</p>
                  <p className="text-xs text-gray-600">{new Date(payment.paymentDate).toLocaleDateString("en-IN")} • {payment.method}</p>
                </div>
                <span className="font-bold text-green-600">{formatAmount(payment.amount)}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate(`/parent/payment-history/${selectedChild.id}`)}
            className="mt-4 w-full text-blue-600 hover:text-blue-800 font-semibold py-2 flex items-center justify-center gap-2"
          >
            View All Transactions <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
