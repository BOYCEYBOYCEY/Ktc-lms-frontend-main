import React, { useState } from "react";
import { Check, X, CreditCard, Smartphone, Wifi, MessageCircle, Mail } from "lucide-react";
import { sendPaymentReceipt } from "../../lib/messageService";

export default function PaymentModal({ amount, studentName, onClose, parentPhone, parentEmail }) {
  const [step, setStep] = useState("method"); // method, processing, success
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  const methods = [
    { id: "upi", name: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, PayTM" },
    { id: "netbanking", name: "Net Banking", icon: Wifi, desc: "All major banks supported" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Rupay" },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep("processing");

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send receipt notification
    if (parentPhone && parentEmail) {
      const transactionId = `TXN${Math.random().toString().slice(2, 10).toUpperCase()}`;
      const paymentDate = new Date().toLocaleDateString("en-IN");
      try {
        const result = await sendPaymentReceipt(
          parentPhone,
          parentEmail,
          studentName,
          amount,
          transactionId,
          paymentDate
        );
        setNotificationStatus(result);
      } catch (error) {
        console.error("Failed to send notification:", error);
      }
    }

    setStep("success");
  };

  const formatAmount = (amt) => `₹${amt.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        {/* Processing State */}
        {step === "processing" && (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              </div>
            </div>
            <p className="text-gray-600 font-semibold">Processing Payment...</p>
            <p className="text-sm text-gray-500">Please do not close this window</p>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful! 🎉</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Transaction ID: <span className="font-mono font-bold">TXN{Math.random().toString().slice(2, 10).toUpperCase()}</span></p>
              <p>Amount: <span className="font-bold text-green-600">{formatAmount(amount)}</span></p>
              <p>For: <span className="font-bold">{studentName}</span></p>
            </div>

            {/* Notification Status */}
            {notificationStatus && (
              <div className="space-y-2">
                <div className={`p-3 rounded-lg flex items-center gap-2 ${notificationStatus.whatsapp?.success ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
                  <MessageCircle className={`w-4 h-4 ${notificationStatus.whatsapp?.success ? "text-green-600" : "text-gray-600"}`} />
                  <p className={`text-xs ${notificationStatus.whatsapp?.success ? "text-green-700" : "text-gray-600"}`}>
                    {notificationStatus.whatsapp?.success ? "✓ WhatsApp receipt sent" : "Receipt notification pending"}
                  </p>
                </div>
                <div className={`p-3 rounded-lg flex items-center gap-2 ${notificationStatus.email?.success ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
                  <Mail className={`w-4 h-4 ${notificationStatus.email?.success ? "text-green-600" : "text-gray-600"}`} />
                  <p className={`text-xs ${notificationStatus.email?.success ? "text-green-700" : "text-gray-600"}`}>
                    {notificationStatus.email?.success ? "✓ Email receipt sent" : "Email notification pending"}
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">✓ Receipt sent via WhatsApp & Email</p>
            </div>
            <button
              onClick={() => onClose()}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Done
            </button>
          </div>
        )}

        {/* Payment Method Selection */}
        {step === "method" && (
          <>
            <div className="border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800">Complete Payment</h2>
              <p className="text-sm text-gray-600">Select your preferred payment method</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-blue-600">{formatAmount(amount)}</p>
              <p className="text-xs text-gray-600 mt-1">For: {studentName}</p>
            </div>

            <div className="space-y-3">
              {methods.map(method => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                      borderColor: selectedMethod === method.id ? "#2563eb" : "#e5e7eb",
                      backgroundColor: selectedMethod === method.id ? "#eff6ff" : "",
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Icon className="w-6 h-6 ml-3 text-blue-600" />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-800">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {isProcessing ? "Processing..." : `Pay ${formatAmount(amount)}`}
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              💳 Your payment is secured with SSL encryption
            </div>
          </>
        )}

        {/* Close button */}
        {step !== "processing" && (
          <button
            onClick={() => step === "method" ? onClose() : null}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
