import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentFeeDetails, getStudentUpcomingFees } from "../../lib/dataHelpers";
import { students } from "../../data/students";
import { feeAddOns, paymentPlans, baseFeesByClass } from "../../data/fees";
import { Download, ArrowLeft, ShoppingCart, Split, AlertCircle } from "lucide-react";
import PaymentModal from "../Fees/PaymentModal";
import PaymentTimeline from "./PaymentTimeline";
import FeeComparison from "./FeeComparison";
import PartialPaymentModal from "./PartialPaymentModal";
import FeeDisputeResolution from "./FeeDisputeResolution";
import { generateFeeInvoice, generateChallan } from "../../lib/generateInvoice";

export default function FeeDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPartialPayment, setShowPartialPayment] = useState(false);
  const [showDispute, setShowDispute] = useState(false);

  const student = students.find(s => s.id === parseInt(studentId));
  const feeDetails = getStudentFeeDetails(parseInt(studentId));
  const upcomingFees = getStudentUpcomingFees(parseInt(studentId));

  // Get parent email from phone
  const parentEmail = user?.parentPhone ? `parent${user.parentPhone.slice(-4)}@ktcmail.com` : "";

  if (!student || !feeDetails) {
    return <div className="p-6">Loading...</div>;
  }

  const baseFee = baseFeesByClass[student.class];
  const plan = paymentPlans[selectedPlan];

  // Calculate add-ons total
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + feeAddOns[addon].amount, 0);
  const subtotal = baseFee + addOnsTotal;

  // Apply discounts
  const discountAmount = subtotal * plan.discount;
  const discountedTotal = subtotal - discountAmount;

  // Apply sibling discount
  const siblingDiscountAmount = discountedTotal * feeDetails.siblingDiscount;
  const afterSiblingDiscount = discountedTotal - siblingDiscountAmount;

  // Apply waiver discount
  const waiverDiscountAmount = afterSiblingDiscount * (feeDetails.totalWaiverDiscount / 100);
  const finalAmount = afterSiblingDiscount - waiverDiscountAmount;

  const amountPerTerm = finalAmount / plan.terms;

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const handleAddOnToggle = (addon) => {
    setSelectedAddOns(prev =>
      prev.includes(addon)
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
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
          <h1 className="text-2xl font-bold text-gray-800">Fee Breakdown</h1>
          <p className="text-gray-600">{student.name} • Class {student.class}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Fee Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Fee */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Base Tuition Fee</h2>
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-gray-600">Annual tuition for {student.class}</p>
              <p className="text-3xl font-bold text-blue-600">{formatAmount(baseFee)}</p>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Optional Add-Ons</h2>
            <div className="space-y-3">
              {Object.entries(feeAddOns).map(([key, addon]) => (
                <label key={key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(key)}
                    onChange={() => handleAddOnToggle(key)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-3 flex-1">
                    <span className="font-semibold text-gray-800">{addon.icon} {addon.name}</span>
                    <p className="text-xs text-gray-500">{addon.name}</p>
                  </span>
                  <span className="text-lg font-bold text-gray-800">{formatAmount(addon.amount)}</span>
                </label>
              ))}
            </div>
            {addOnsTotal > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatAmount(addOnsTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Plan */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Plan</h2>
            <div className="space-y-3">
              {Object.entries(paymentPlans).map(([key, planInfo]) => (
                <label key={key} className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition hover:bg-blue-50"
                  style={{ borderColor: selectedPlan === key ? '#2563eb' : '#e5e7eb' }}>
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={selectedPlan === key}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 flex-1">
                    <span className="font-semibold text-gray-800">{planInfo.label}</span>
                    <p className="text-xs text-gray-500">{planInfo.terms === 1 ? 'Single payment' : `${planInfo.terms} installments`}</p>
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {planInfo.discount > 0 && <span className="text-green-600">Save {(planInfo.discount * 100).toFixed(0)}%</span>}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Fee Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Fee Summary</h2>

            <div className="space-y-3 text-sm border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Tuition</span>
                <span className="font-semibold">{formatAmount(baseFee)}</span>
              </div>
              {selectedAddOns.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons</span>
                  <span className="font-semibold">{formatAmount(addOnsTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>Subtotal</span>
                <span>{formatAmount(subtotal)}</span>
              </div>
            </div>

            {/* Discounts - IMPROVED VISIBILITY */}
            {(plan.discount > 0 || feeDetails.siblingDiscount > 0 || feeDetails.totalWaiverDiscount > 0) && (
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 space-y-2">
                <p className="text-sm font-bold text-green-800 mb-2">💰 Your Savings:</p>
                {plan.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">• {plan.label} Plan ({(plan.discount * 100).toFixed(0)}% off)</span>
                    <span className="font-bold text-green-700">-{formatAmount(discountAmount)}</span>
                  </div>
                )}
                {feeDetails.siblingDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">• Sibling Discount ({(feeDetails.siblingDiscount * 100).toFixed(0)}% off)</span>
                    <span className="font-bold text-green-700">-{formatAmount(siblingDiscountAmount)}</span>
                  </div>
                )}
                {feeDetails.totalWaiverDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">• Scholarship/Waiver ({feeDetails.totalWaiverDiscount}% off)</span>
                    <span className="font-bold text-green-700">-{formatAmount(waiverDiscountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-green-300 pt-2 mt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-green-800">Total Savings:</span>
                    <span className="text-green-800">-{formatAmount(discountAmount + siblingDiscountAmount + waiverDiscountAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Total - IMPROVED VISIBILITY */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg">
              <p className="text-sm text-blue-100 mb-2">💳 Total Amount Due</p>
              <p className="text-4xl font-bold text-white mb-1">{formatAmount(finalAmount)}</p>
              <div className="bg-blue-400/30 rounded-lg p-2 mt-3">
                <p className="text-xs text-blue-50">
                  {plan.terms === 1
                    ? "✓ Pay once for the full year"
                    : `✓ ${plan.terms} installments of ${formatAmount(amountPerTerm)} each`
                  }
                </p>
              </div>
              {subtotal > finalAmount && (
                <div className="mt-3 pt-3 border-t border-blue-400">
                  <p className="text-xs text-blue-100">Original: {formatAmount(subtotal)}</p>
                  <p className="text-sm font-bold text-green-300">You save: {formatAmount(subtotal - finalAmount)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  try {
                    console.log("🧾 Generating fee invoice...");
                    generateFeeInvoice(student, {
                      baseFee,
                      addOns: selectedAddOns,
                      subtotal,
                      discountAmount,
                      siblingDiscountAmount,
                      waiverDiscountAmount,
                      finalAmount,
                    });
                    console.log("✅ Invoice generated successfully");
                  } catch (error) {
                    console.error("❌ Invoice generation failed:", error);
                    alert("Failed to generate invoice: " + error.message);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Generate Fee Statement
              </button>
              <button
                onClick={() => {
                  try {
                    console.log("🧾 Generating challan...");
                    generateChallan(student, finalAmount);
                    console.log("✅ Challan generated successfully");
                  } catch (error) {
                    console.error("❌ Challan generation failed:", error);
                    alert("Failed to generate challan: " + error.message);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Generate Bank Challan
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Pay Full Amount
              </button>
              <button
                onClick={() => setShowPartialPayment(true)}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <Split className="w-4 h-4" />
                Split Payment
              </button>
              <button
                onClick={() => setShowDispute(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <AlertCircle className="w-4 h-4" />
                Report Dispute
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Timeline */}
      <PaymentTimeline fees={feeDetails} plan={selectedPlan} />

      {/* Fee Comparison */}
      <FeeComparison currentFee={finalAmount} lastYearFee={baseFeesByClass[student.class] * 0.92} />

      {/* Upcoming Fees */}
      {upcomingFees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Upcoming One-Time Fees</h2>
          <div className="space-y-3">
            {upcomingFees.map(fee => (
              <div key={fee.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-800">{fee.title}</p>
                  <p className="text-sm text-gray-600">{fee.description}</p>
                  <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString("en-IN")}</p>
                </div>
                <span className="font-bold text-lg text-blue-600">{formatAmount(fee.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modals */}
      {showPaymentModal && (
        <PaymentModal
          amount={finalAmount}
          studentName={student.name}
          onClose={() => setShowPaymentModal(false)}
          parentPhone={user?.parentPhone}
          parentEmail={parentEmail}
        />
      )}

      {showPartialPayment && (
        <PartialPaymentModal
          totalAmount={finalAmount}
          studentName={student.name}
          onClose={() => setShowPartialPayment(false)}
          onPayment={(payments) => {
            console.log("Partial payment scheduled:", payments);
            setShowPartialPayment(false);
          }}
        />
      )}

      {showDispute && (
        <FeeDisputeResolution
          studentName={student.name}
          amount={finalAmount}
          onClose={() => setShowDispute(false)}
        />
      )}
    </div>
  );
}
