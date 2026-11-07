// AdminHome.jsx
import React from "react";
import PerformanceChart from "./PerformanceChart";
import TeacherActivityFeed from "./TeacherActivityFeed";
import { getSchoolStats, getAtRiskStudents } from "../../lib/dataHelpers";
import { performanceTrends, teacherActivity } from "../../data/trends";
import { AlertTriangle, TrendingDown, Award } from "lucide-react";

export default function AdminHome() {
    const stats = getSchoolStats();
    const allAtRiskStudents = getAtRiskStudents();
    const atRiskStudents = allAtRiskStudents.slice(0, 10); // Show top 10 on dashboard

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Main Content (col-span-2) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">👩‍🏫</div>
                            <div className="text-xl font-bold">{stats.totalTeachers}</div>
                            <div className="text-gray-500 text-sm">Total Teachers</div>
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">👨‍🎓</div>
                            <div className="text-xl font-bold">{stats.totalStudents}</div>
                            <div className="text-gray-500 text-sm">Total Students</div>
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">📅</div>
                            <div className="text-xl font-bold">{stats.avgAttendance}%</div>
                            <div className="text-gray-500 text-sm">Avg Attendance</div>
                        </div>
                    </div>

                    {/* Performance Chart - Clear Metrics */}
                    <PerformanceChart data={performanceTrends} />

                    {/* At-Risk Students - HERO SECTION */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg p-6 border border-red-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                                <h3 className="text-xl font-bold text-gray-800">
                                    Students Needing Intervention
                                </h3>
                            </div>
                            <span className="bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                                {allAtRiskStudents.length} Total
                            </span>
                        </div>
                        <div className="space-y-3">
                            {atRiskStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition ${
                                        student.severity === "critical"
                                            ? "bg-red-100 border-l-red-600"
                                            : "bg-yellow-100 border-l-yellow-600"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800">
                                                {student.name}
                                            </div>
                                            <div className="text-sm text-gray-700 mt-1">
                                                Class {student.class} • Marks: {student.currentAvgMarks}% • Attendance: {student.attendance}%
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
                                        <div className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap ml-2 ${
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
                        {allAtRiskStudents.length > 10 && (
                            <button className="w-full mt-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 border-t border-red-200 pt-4">
                                View all {allAtRiskStudents.length - 10} more students →
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Reference & Activity (col-span-1) */}
                <div className="space-y-6">
                    {/* Teacher Activity Feed */}
                    <TeacherActivityFeed activities={teacherActivity} />

                    {/* Class Performance Reference */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <Award className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="text-sm font-semibold text-gray-800">
                                Class Performance
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {stats.classStats.map((classInfo) => (
                                <div
                                    key={classInfo.className}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-800 text-sm">
                                            Class {classInfo.className}
                                        </span>
                                        {classInfo.atRiskCount > 0 && (
                                            <span className="text-xs text-red-600 font-bold">
                                                ⚠️ {classInfo.atRiskCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {classInfo.avgMarks}% avg • {classInfo.avgAttendance}% attendance
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                            School Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Avg Marks</span>
                                <span className="font-bold text-blue-600">{stats.avgMarks}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Avg Attendance</span>
                                <span className="font-bold text-green-600">{stats.avgAttendance}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Classes</span>
                                <span className="font-bold text-purple-600">{stats.totalClasses}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
