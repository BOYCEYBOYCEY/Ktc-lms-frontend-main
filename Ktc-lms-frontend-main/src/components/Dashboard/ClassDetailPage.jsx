import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Users } from "lucide-react";
import { students } from "../../data/students";
import { attendance } from "../../data/attendance";
import { marks } from "../../data/marks";
import { getAtRiskStudents } from "../../lib/dataHelpers";

export default function ClassDetailPage() {
  const { className } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname.includes("/teacher/");
  const allAtRisk = getAtRiskStudents();

  const classStudents = students.filter((s) => s.class === className);
  const atRiskInClass = allAtRisk.filter((s) => s.class === className);

  if (!classStudents.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Class not found</p>
      </div>
    );
  }

  const avgMarks = Math.round(
    classStudents.reduce((sum, s) => {
      const m = marks[s.id];
      const avg = Object.values(m.currentMarks).reduce((a, b) => a + b) / 5;
      return sum + avg;
    }, 0) / classStudents.length
  );

  const avgAttendance = Math.round(
    classStudents.reduce((sum, s) => sum + attendance[s.id], 0) /
      classStudents.length
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(isTeacher ? "/teacher" : "/admin")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-800">Class {className}</h1>
        <p className="text-gray-600 mt-2">
          {classStudents.length} students • Avg {avgMarks}% marks • {avgAttendance}
          % attendance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {classStudents.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Average Marks</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgMarks}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Average Attendance</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {avgAttendance}%
          </p>
        </div>
      </div>

      {/* At-Risk Alert */}
      {atRiskInClass.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-bold text-red-700">
              {atRiskInClass.length} Students Need Intervention
            </h2>
          </div>
          <div className="space-y-2">
            {atRiskInClass.map((s) => (
              <div key={s.id} className="text-sm text-red-700">
                • {s.name} - {s.reasons[0]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Students */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Student List</h2>
        <div className="space-y-2">
          {classStudents.map((student) => {
            const isAtRisk = atRiskInClass.some((s) => s.id === student.id);
            const studentMarks = marks[student.id];
            const avgStudentMarks = Math.round(
              Object.values(studentMarks.currentMarks).reduce((a, b) => a + b) /
                5
            );

            return (
              <button
                key={student.id}
                onClick={() => navigate(`${isTeacher ? "/teacher" : "/admin"}/student/${student.id}`)}
                className={`w-full text-left p-4 rounded-lg border-l-4 hover:shadow-md transition ${
                  isAtRisk
                    ? "bg-red-50 border-l-red-600 hover:bg-red-100"
                    : "bg-gray-50 border-l-gray-300 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {student.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Roll No. {student.rollNo} • {avgStudentMarks}% • {attendance[student.id]}% attendance
                    </p>
                  </div>
                  {isAtRisk && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      AT-RISK
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
