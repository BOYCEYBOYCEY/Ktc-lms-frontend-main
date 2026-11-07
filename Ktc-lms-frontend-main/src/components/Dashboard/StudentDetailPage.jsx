import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertTriangle, TrendingDown, Calendar } from "lucide-react";
import { getStudentDetail, getAtRiskStudents } from "../../lib/dataHelpers";

export default function StudentDetailPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname.includes("/teacher/");
  const student = getStudentDetail(parseInt(studentId));
  const allAtRisk = getAtRiskStudents();
  const atRiskInfo = allAtRisk.find((s) => s.id === parseInt(studentId));

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Student not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(isTeacher ? "/teacher" : "/admin")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-gray-600 mt-2">
              Admission: {student.admissionNo} • Class {student.class}
            </p>
            <p className="text-gray-600">
              Parent: {student.parentName} • {student.parentPhone}
            </p>
          </div>
          {atRiskInfo && (
            <div
              className={`px-4 py-2 rounded-lg text-white font-bold ${
                atRiskInfo.severity === "critical"
                  ? "bg-red-600"
                  : "bg-yellow-600"
              }`}
            >
              {atRiskInfo.severity.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Box */}
          {atRiskInfo && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow p-6 border border-red-200">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h2 className="text-lg font-bold text-red-700">
                  Reasons for Concern
                </h2>
              </div>
              <div className="space-y-2">
                {atRiskInfo.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-red-700 text-sm"
                  >
                    <TrendingDown className="w-4 h-4 mr-2 flex-shrink-0" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Current Academic Performance
            </h2>
            <div className="space-y-3">
              {Object.entries(student.marks.currentMarks).map(([subject, marks]) => (
                <div key={subject}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-700">{subject}</span>
                    <span className="font-bold text-gray-800">
                      {Math.round(marks)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition ${
                        marks < 40
                          ? "bg-red-600"
                          : marks < 60
                          ? "bg-yellow-500"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(marks, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marks Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Previous Performance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(student.marks.previousMarks).map(
                ([subject, marks]) => (
                  <div
                    key={subject}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <p className="text-sm text-gray-600">{subject}</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {Math.round(marks)}%
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attendance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Attendance</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {student.attendance}%
              </div>
              <p className="text-sm text-gray-600">Present this month</p>
              {student.attendance < 75 && (
                <p className="text-xs text-red-600 font-semibold mt-2">
                  ⚠️ Below acceptable level (75%)
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Trend</span>
                <span className="font-bold text-gray-800">
                  {student.marks.trend}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Current</span>
                <span className="font-bold text-gray-800">
                  {student.avgCurrentMarks}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Previous</span>
                <span className="font-bold text-gray-800">
                  {student.avgPreviousMarks}%
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-gray-600">Drop</span>
                <span className="font-bold text-red-600">
                  {student.avgPreviousMarks - student.avgCurrentMarks}%
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-3">
              Recommended Actions
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Schedule parent-teacher meeting</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Assign peer tutoring / mentorship</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Monitor attendance closely</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Provide extra support sessions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
