import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function FeeWaiverRequest() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form, success
  const [formData, setFormData] = useState({
    waiverType: "hardship",
    requestedDiscount: 25,
    reason: "",
    documents: [],
  });

  const student = students.find(s => s.id === parseInt(studentId));

  if (!student) {
    return <div className="p-6">Loading...</div>;
  }

  const waiverTypes = [
    { id: "merit", label: "Merit Scholar", desc: "Excellent academic performance" },
    { id: "hardship", label: "Financial Hardship", desc: "Economic difficulty" },
    { id: "sibling", label: "Sibling Discount", desc: "Multiple children in school" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      alert("Please explain your request");
      return;
    }
    setStep("success");
    setTimeout(() => {
      navigate(-1);
    }, 3000);
  };

  if (step === "success") {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your waiver request has been submitted for review. You will receive an email notification once the principal approves or rejects your request.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-700">Expected response time: 3-5 business days</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-800">Request Fee Waiver</h1>
          <p className="text-gray-600">{student.name} • Class {student.class}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Waiver Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">What type of waiver are you requesting?</label>
              <div className="space-y-3">
                {waiverTypes.map(type => (
                  <label key={type.id} className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                      borderColor: formData.waiverType === type.id ? "#2563eb" : "#e5e7eb",
                      backgroundColor: formData.waiverType === type.id ? "#eff6ff" : "",
                    }}>
                    <input
                      type="radio"
                      name="waiverType"
                      value={type.id}
                      checked={formData.waiverType === type.id}
                      onChange={(e) => setFormData({ ...formData, waiverType: e.target.value })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-800">{type.label}</p>
                      <p className="text-xs text-gray-600">{type.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount Requested */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Requested Discount %</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={formData.requestedDiscount}
                  onChange={(e) => setFormData({ ...formData, requestedDiscount: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-2xl font-bold text-blue-600 w-16">{formData.requestedDiscount}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">The principal will review and adjust if needed</p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Reason for Request *</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why you believe a fee waiver should be granted. This helps the principal make a fair decision."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Min 20 characters required</p>
            </div>

            {/* Supporting Documents (Mock) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Supporting Documents (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <p className="text-gray-600">📄 Upload income certificate, employment letter, or medical documents</p>
                <p className="text-xs text-gray-500 mt-2">(Mock feature - for demo only)</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.reason || formData.reason.length < 20}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          {/* Timeline */}
          <div className="bg-blue-50 rounded-lg shadow p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ Timeline</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Request Submitted</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Under Review</p>
                  <p className="text-xs text-gray-600">1-3 days</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Decision Notified</p>
                  <p className="text-xs text-gray-600">3-5 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Waiver Types Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ℹ️ Waiver Types</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm text-gray-800">Merit Scholar</p>
                <p className="text-xs text-gray-600">For excellent academic performance (90%+)</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Financial Hardship</p>
                <p className="text-xs text-gray-600">For families facing economic difficulty</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Sibling Discount</p>
                <p className="text-xs text-gray-600">When multiple children study in school</p>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Tips</h3>
            <ul className="text-xs text-gray-700 space-y-2 list-disc list-inside">
              <li>Be honest and detailed in your request</li>
              <li>Provide supporting documents if possible</li>
              <li>Contact the office if you need clarification</li>
              <li>Requests are reviewed fairly by the principal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
