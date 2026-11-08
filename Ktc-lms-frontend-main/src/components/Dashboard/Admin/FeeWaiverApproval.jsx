import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { feeWaivers } from "../../../data/feeWaivers";
import { ArrowLeft, Check, X } from "lucide-react";

export default function FeeWaiverApproval() {
  const navigate = useNavigate();
  const [waivers, setWaivers] = useState(feeWaivers);
  const [selectedWaivers, setSelectedWaivers] = useState([]);

  const pendingWaivers = waivers.filter(w => w.status === "pending");
  const approvedWaivers = waivers.filter(w => w.status === "approved");
  const rejectedWaivers = waivers.filter(w => w.status === "rejected");

  const handleApprove = (id) => {
    setWaivers(prev =>
      prev.map(w => w.id === id ? { ...w, status: "approved", approvedBy: "Principal" } : w)
    );
    setSelectedWaivers(prev => prev.filter(wId => wId !== id));
  };

  const handleReject = (id) => {
    setWaivers(prev =>
      prev.map(w => w.id === id ? { ...w, status: "rejected" } : w)
    );
    setSelectedWaivers(prev => prev.filter(wId => wId !== id));
  };

  const handleBulkApprove = () => {
    setWaivers(prev =>
      prev.map(w => selectedWaivers.includes(w.id) ? { ...w, status: "approved", approvedBy: "Principal" } : w)
    );
    setSelectedWaivers([]);
  };

  const toggleSelection = (id) => {
    setSelectedWaivers(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 Fee Waiver Approvals</h1>
          <p className="text-gray-600">Review and approve waiver requests</p>
        </div>
      </div>

      {/* Pending Waivers */}
      {pendingWaivers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">⏳ Pending Requests ({pendingWaivers.length})</h2>
            {selectedWaivers.length > 0 && (
              <div className="space-x-2">
                <button
                  onClick={handleBulkApprove}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  ✓ Approve All ({selectedWaivers.length})
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {pendingWaivers.map(waiver => (
              <div key={waiver.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedWaivers.includes(waiver.id)}
                    onChange={() => toggleSelection(waiver.id)}
                    className="w-5 h-5 text-blue-600 mt-1 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{waiver.studentName}</h3>
                        <p className="text-sm text-gray-600">Class {waiver.class} • Student ID: {waiver.studentId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        waiver.type === "merit" ? "bg-blue-100 text-blue-800" :
                        waiver.type === "hardship" ? "bg-orange-100 text-orange-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {waiver.type.charAt(0).toUpperCase() + waiver.type.slice(1)} • {waiver.discountPercent}% off
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-sm text-gray-700"><span className="font-semibold">Reason:</span> {waiver.reason}</p>
                    </div>

                    <div className="text-xs text-gray-600">
                      Applied: {new Date(waiver.appliedDate).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(waiver.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(waiver.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingWaivers.length === 0 && (
        <div className="bg-green-50 rounded-lg p-8 text-center border-2 border-green-200">
          <p className="text-lg font-bold text-green-800">✓ All caught up!</p>
          <p className="text-gray-600 mt-2">No pending waiver requests</p>
        </div>
      )}

      {/* Approved Waivers */}
      {approvedWaivers.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-gray-800">✓ Approved ({approvedWaivers.length})</h2>
          <div className="space-y-2">
            {approvedWaivers.map(waiver => (
              <div key={waiver.id} className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{waiver.studentName} (Class {waiver.class})</p>
                  <p className="text-sm text-gray-600">{waiver.type} • {waiver.discountPercent}% • Valid until {new Date(waiver.validUntil).toLocaleDateString("en-IN")}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">Approved</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Waivers */}
      {rejectedWaivers.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-gray-800">✗ Rejected ({rejectedWaivers.length})</h2>
          <div className="space-y-2">
            {rejectedWaivers.map(waiver => (
              <div key={waiver.id} className="bg-red-50 rounded-lg shadow p-4 border-l-4 border-red-500 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{waiver.studentName} (Class {waiver.class})</p>
                  <p className="text-sm text-gray-600">{waiver.type} • {waiver.discountPercent}%</p>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">Rejected</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
