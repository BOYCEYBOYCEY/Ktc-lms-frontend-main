import React, { useState } from "react";
import { MessageCircle, CheckCircle, Clock, AlertCircle, Send } from "lucide-react";

export default function FeeDisputeResolution({ studentName, amount, onClose }) {
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      date: "2026-11-05",
      issue: "Duplicate charge for bus fee",
      status: "open", // open, in-review, resolved
      reason: "My son had bus fee waived last month. This shouldn't be charged.",
      adminResponse: null,
      messages: [],
    },
  ]);

  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [newIssue, setNewIssue] = useState("");
  const [newReason, setNewReason] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedDispute = {
      ...selectedDispute,
      messages: [
        ...selectedDispute.messages,
        {
          id: Date.now(),
          sender: "parent",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };

    // Simulate admin reply after 2 seconds
    setTimeout(() => {
      updatedDispute.messages.push({
        id: Date.now() + 1,
        sender: "admin",
        message: "Thank you for the clarification. I'm reviewing this with the finance team.",
        timestamp: new Date().toLocaleTimeString(),
      });

      setDisputes(
        disputes.map((d) => (d.id === selectedDispute.id ? updatedDispute : d))
      );
      setSelectedDispute(updatedDispute);
    }, 2000);

    setDisputes(disputes.map((d) => (d.id === selectedDispute.id ? updatedDispute : d)));
    setSelectedDispute(updatedDispute);
    setNewMessage("");
  };

  const handleNewDispute = () => {
    if (!newIssue.trim() || !newReason.trim()) return;

    const dispute = {
      id: disputes.length + 1,
      date: new Date().toLocaleDateString("en-IN"),
      issue: newIssue,
      status: "open",
      reason: newReason,
      adminResponse: null,
      messages: [],
    };

    setDisputes([...disputes, dispute]);
    setSelectedDispute(dispute);
    setShowNewDispute(false);
    setNewIssue("");
    setNewReason("");
  };

  const getStatusColor = (status) => {
    if (status === "open") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (status === "in-review") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const getStatusIcon = (status) => {
    if (status === "open") return <AlertCircle className="w-4 h-4" />;
    if (status === "in-review") return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-lg font-bold text-gray-800">Fee Dispute Resolution</h2>
          <p className="text-sm text-gray-600">Report issues and track resolutions</p>
        </div>

        {/* Main Content */}
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Disputes List */}
          <div className="w-64 border-r overflow-y-auto p-4 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Your Disputes</h3>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {disputes.length}
              </span>
            </div>

            {disputes.map((dispute) => (
              <button
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedDispute.id === dispute.id
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(dispute.status)}
                  <span className="text-xs font-semibold text-gray-500">{dispute.date}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{dispute.issue}</p>
                <div className={`text-xs font-bold mt-2 inline-block px-2 py-1 rounded border ${getStatusColor(dispute.status)}`}>
                  {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowNewDispute(true)}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition mt-4"
            >
              + Report New Issue
            </button>
          </div>

          {/* Dispute Details */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!showNewDispute && selectedDispute ? (
              <>
                {/* Dispute Info */}
                <div className="p-4 border-b space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Issue</p>
                    <p className="font-semibold text-gray-800">{selectedDispute.issue}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">Your Description</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{selectedDispute.reason}</p>
                  </div>

                  <div className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(selectedDispute.status)}`}>
                    {selectedDispute.status === "open" && "🟡 Open"}
                    {selectedDispute.status === "in-review" && "🔵 In Review"}
                    {selectedDispute.status === "resolved" && "🟢 Resolved"}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {selectedDispute.messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No responses yet. We'll reply within 24 hours.</p>
                    </div>
                  ) : (
                    selectedDispute.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.sender === "parent"
                              ? "bg-blue-100 text-gray-800 border border-blue-200"
                              : "bg-green-100 text-gray-800 border border-green-200"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-gray-600 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                {selectedDispute.status !== "resolved" && (
                  <div className="border-t p-3 bg-white flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* New Dispute Form */
              <div className="p-4 space-y-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-800">Report a New Dispute</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Incorrect fee amount</option>
                    <option>Duplicate charge</option>
                    <option>Wrong add-on charged</option>
                    <option>Discount not applied</option>
                    <option>Service quality issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Description
                  </label>
                  <input
                    type="text"
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    placeholder="Brief title of the issue"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Explanation
                  </label>
                  <textarea
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Please provide as much detail as possible..."
                    rows="4"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewDispute(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewDispute}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Submit Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-600">We respond to disputes within 24 hours during business days</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
