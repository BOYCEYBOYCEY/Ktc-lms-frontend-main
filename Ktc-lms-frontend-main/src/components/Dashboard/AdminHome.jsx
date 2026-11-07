// AdminHome.jsx
import React, { useState } from "react";
import Messages from "./Messages";
import PerformanceChart from "./PerformanceChart";
import TeacherActivityFeed from "./TeacherActivityFeed";
import { getSchoolStats, getAtRiskStudents } from "../../lib/dataHelpers";
import { performanceTrends, teacherActivity } from "../../data/trends";
import { AlertTriangle, TrendingDown, Award } from "lucide-react";

export default function AdminHome() {
    const stats = getSchoolStats();
    const atRiskStudents = getAtRiskStudents();
    const [selectedStudent, setSelectedStudent] = useState(null);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Overview Cards - Real Data */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">👩‍🏫</div>
                            <div className="text-xl font-bold">{stats.totalTeachers}</div>
                            <div className="text-gray-500 text-sm">
                                Total Teachers
                            </div>
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">👨‍🎓</div>
                            <div className="text-xl font-bold">{stats.totalStudents}</div>
                            <div className="text-gray-500 text-sm">
                                Total Students
                            </div>
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">📅</div>
                            <div className="text-xl font-bold">{stats.avgAttendance}%</div>
                            <div className="text-gray-500 text-sm">
                                School Avg Attendance
                            </div>
                        </div>
                    </div>

                    {/* Performance Trend Chart */}
                    <PerformanceChart data={performanceTrends} />

                    {/* Class Performance Summary */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <Award className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">
                                Class-wise Performance
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {stats.classStats.map((classInfo) => (
                                <div
                                    key={classInfo.className}
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">
                                            Class {classInfo.className}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {classInfo.totalStudents} students • Avg {classInfo.avgMarks}% marks
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-800">
                                            {classInfo.avgAttendance}%
                                        </div>
                                        {classInfo.atRiskCount > 0 && (
                                            <div className="text-xs text-red-600 font-semibold">
                                                ⚠️ {classInfo.atRiskCount} at-risk
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* At-Risk Students - HERO FEATURE */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow p-6 border border-red-200">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">
                                Students Needing Intervention
                            </h3>
                            <span className="ml-auto bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {atRiskStudents.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {atRiskStudents.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition ${
                                        student.severity === "critical"
                                            ? "bg-red-100 border-l-red-600 hover:bg-red-150"
                                            : "bg-yellow-100 border-l-yellow-600 hover:bg-yellow-150"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800">
                                                {student.name}
                                            </div>
                                            <div className="text-sm text-gray-700 mt-1">
                                                Class {student.class} • Avg Marks: {student.currentAvgMarks}% • Attendance: {student.attendance}%
                                            </div>
                                            <div className="text-xs text-gray-600 mt-2 space-y-1">
                                                {student.reasons.map((reason, idx) => (
                                                    <div key={idx} className="flex items-center">
                                                        <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                                                        {reason}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded text-xs font-bold ${
                                            student.severity === "critical"
                                                ? "bg-red-600 text-white"
                                                : "bg-yellow-600 text-white"
                                        }`}>
                                            {student.severity.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Inbox */}
                    <Messages />{" "}
                    {/* Modal logic is still inside Messages.jsx */}
                </div>

                {/* RIGHT SIDE: Sidebar */}
                <div className="space-y-6">
                    {/* Teacher Activity Feed */}
                    <TeacherActivityFeed activities={teacherActivity} />

                    {/* At-Risk Summary Card */}
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">
                            At-Risk Alert
                        </h3>
                        <div className="text-3xl font-bold mb-2">
                            {atRiskStudents.length}
                        </div>
                        <p className="text-sm text-red-100 mb-4">
                            Students need immediate intervention
                        </p>
                        <div className="space-y-1 text-xs">
                            {atRiskStudents.slice(0, 3).map((s) => (
                                <div key={s.id} className="flex items-center">
                                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                                    {s.name} - {s.severity}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white text-black rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                <span className="text-sm font-medium">Avg Class Marks</span>
                                <span className="text-lg font-bold text-blue-600">{stats.avgMarks}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                <span className="text-sm font-medium">Avg Attendance</span>
                                <span className="text-lg font-bold text-green-600">{stats.avgAttendance}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                <span className="text-sm font-medium">Total Classes</span>
                                <span className="text-lg font-bold text-purple-600">{stats.totalClasses}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
