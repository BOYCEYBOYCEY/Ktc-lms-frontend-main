import React, { useState } from "react";
import { X, Split, CheckCircle } from "lucide-react";

export default function PartialPaymentModal({ totalAmount, studentName, onClose, onPayment }) {
  const [step, setStep] = useState("method"); // method, amount, confirm, success
  const [paymentMethod, setPaymentMethod] = useState("split");
  const [firstAmount, setFirstAmount] = useState(Math.round(totalAmount / 2));
  const [secondAmount, setSecondAmount] = useState(totalAmount - Math.round(totalAmount / 2));
  const [firstDate, setFirstDate] = useState(new Date().toISOString().split("T")[0]);
  const [secondDate, setSecondDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const methods = [
    { id: "split", name: "Split Payment", desc: "Pay part now, rest later" },
    { id: "installment", name: "Monthly Installment", desc: "Pay in 2-3 monthly parts" },
  ];

  const formatAmount = (amt) => `₹${amt.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const handleFirstAmountChange = (value) => {
    const num = Math.min(value, totalAmount - 1000);
    setFirstAmount(num);
    setSecondAmount(totalAmount - num);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const payments = [
      { amount: firstAmount, dueDate: firstDate, status: "completed", transactionId: `TXN${Math.random().toString().slice(2, 10)}` },
      { amount: secondAmount, dueDate: secondDate, status: "scheduled", transactionId: `TXN${Math.random().toString().slice(2, 10)}` },
    ];

    onPayment(payments);
    setStep("success");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4 max-h-96 overflow-y-auto">
        {/* Method Selection */}
        {step === "method" && (
          <>
            <div className="border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Split className="w-5 h-5 text-blue-600" />
                Split Payment
              </h2>
              <p className="text-sm text-gray-600 mt-1">Spread the cost with flexible payment options</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Amount Due</p>
              <p className="text-3xl font-bold text-blue-600">{formatAmount(totalAmount)}</p>
              <p className="text-xs text-gray-600 mt-1">For: {studentName}</p>
            </div>

            <div className="space-y-3">
              {methods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                  style={{
                    borderColor: paymentMethod === method.id ? "#2563eb" : "#e5e7eb",
                    backgroundColor: paymentMethod === method.id ? "#eff6ff" : "",
                  }}
                >
                  <input
                    type="radio"
                    name="method"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => setStep("amount")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Continue
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </>
        )}

        {/* Amount & Date Selection */}
        {step === "amount" && (
          <>
            <div className="border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800">Payment Schedule</h2>
              <p className="text-sm text-gray-600 mt-1">Arrange your payment dates</p>
            </div>

            <div className="space-y-4">
              {/* First Payment */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-sm font-semibold text-gray-800 mb-2">Payment 1 (Now)</p>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Amount</label>
                    <input
                      type="range"
                      min="1000"
                      max={totalAmount - 1000}
                      value={firstAmount}
                      onChange={(e) => handleFirstAmountChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-2xl font-bold text-green-600">{formatAmount(firstAmount)}</p>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Date</label>
                    <input type="date" value={firstDate} onChange={(e) => setFirstDate(e.target.value)} className="w-full px-2 py-2 border rounded text-sm" />
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-2">✓ Pay this amount immediately</p>
              </div>

              {/* Second Payment */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm font-semibold text-gray-800 mb-2">Payment 2 (Later)</p>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Amount</label>
                    <p className="text-2xl font-bold text-yellow-600">{formatAmount(secondAmount)}</p>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Due Date</label>
                    <input type="date" value={secondDate} onChange={(e) => setSecondDate(e.target.value)} className="w-full px-2 py-2 border rounded text-sm" />
                  </div>
                </div>
                <p className="text-xs text-yellow-700 mt-2">⏰ Pay remaining amount by this date</p>
              </div>

              {/* Total */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Total:</span>
                  <span className="text-lg font-bold text-gray-800">{formatAmount(firstAmount + secondAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep("method")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("confirm")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Confirm
              </button>
            </div>
          </>
        )}

        {/* Confirm */}
        {step === "confirm" && (
          <>
            <div className="border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800">Confirm Payment Plan</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Payment 1 (Now)</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(firstAmount)}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>

              <div className="text-center text-gray-400 text-sm font-bold">+</div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-1">Payment 2 (Later)</p>
                <p className="text-2xl font-bold text-yellow-600">{formatAmount(secondAmount)}</p>
                <p className="text-xs text-gray-500">{new Date(secondDate).toLocaleDateString("en-IN")}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  ✓ After Payment 1, you'll receive a confirmation. Payment 2 reminders will be sent 3 days before the due date.
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {isProcessing ? "Processing..." : `Pay ${formatAmount(firstAmount)} Now`}
            </button>

            <button
              onClick={() => setStep("amount")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
            >
              Back
            </button>
          </>
        )}

        {/* Success */}
        {step === "success" && (
          <>
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Payment Plan Created! 🎉</h2>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>First Payment:</strong> {formatAmount(firstAmount)} (Completed)
                </p>
                <p>
                  <strong>Second Payment:</strong> {formatAmount(secondAmount)} (Due {new Date(secondDate).toLocaleDateString("en-IN")})
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  ✓ Payment plan confirmed. Reminders will be sent via WhatsApp & Email.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Done
              </button>
            </div>
          </>
        )}

        {/* Close button */}
        {step !== "confirm" && (
          <button
            onClick={() => (step === "method" ? onClose() : setStep("method"))}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
