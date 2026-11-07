import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, TrendingDown, Filter } from "lucide-react";
import { getAtRiskStudents } from "../../lib/dataHelpers";

export default function AtRiskListPage() {
  const navigate = useNavigate();
  const allAtRiskStudents = getAtRiskStudents();
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filteredStudents =
    filterSeverity === "all"
      ? allAtRiskStudents
      : allAtRiskStudents.filter((s) => s.severity === filterSeverity);

  const criticalCount = allAtRiskStudents.filter(
    (s) => s.severity === "critical"
  ).length;
  const warningCount = allAtRiskStudents.filter(
    (s) => s.severity === "warning"
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-800">
          All At-Risk Students
        </h1>
        <p className="text-gray-600 mt-2">
          {allAtRiskStudents.length} students need intervention
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total At-Risk</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {allAtRiskStudents.length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Critical</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {criticalCount}
              </p>
            </div>
            <div className="text-red-600 text-2xl font-bold opacity-20">!</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Warning</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {warningCount}
              </p>
            </div>
            <div className="text-yellow-600 text-2xl font-bold opacity-20">⚠</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <button
          onClick={() => setFilterSeverity("all")}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterSeverity === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({allAtRiskStudents.length})
        </button>
        <button
          onClick={() => setFilterSeverity("critical")}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterSeverity === "critical"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setFilterSeverity("warning")}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterSeverity === "warning"
              ? "bg-yellow-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Warning ({warningCount})
        </button>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            onClick={() => navigate(`/admin/student/${student.id}`)}
            className={`w-full text-left p-6 rounded-lg border-l-4 hover:shadow-lg transition transform hover:scale-101 bg-white ${
              student.severity === "critical"
                ? "border-l-red-600 hover:bg-red-50"
                : "border-l-yellow-600 hover:bg-yellow-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {student.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold text-white ${
                      student.severity === "critical"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {student.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  Class {student.class} • Admission: {student.admissionNo}
                </p>
                <div className="mt-3 text-sm text-gray-700">
                  <div className="flex gap-4">
                    <span>Avg Marks: <strong>{student.currentAvgMarks}%</strong></span>
                    <span>Attendance: <strong>{student.attendance}%</strong></span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {student.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-600">
                      <TrendingDown className="w-3 h-3 mr-2 text-red-600 flex-shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-gray-400 text-2xl ml-4">→</div>
            </div>
          </button>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No students found in this category</p>
        </div>
      )}
    </div>
  );
}
