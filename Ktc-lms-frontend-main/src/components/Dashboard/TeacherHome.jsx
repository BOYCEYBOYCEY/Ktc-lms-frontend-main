import React from "react";
import { useNavigate } from "react-router-dom";
import PerformanceChart from "./PerformanceChart";
import TeacherActivityFeed from "./TeacherActivityFeed";
import { getSchoolStats } from "../../lib/dataHelpers";
import { performanceTrends, teacherActivity } from "../../data/trends";
import { classData } from "../../data/teachers";
import { Users, AlertTriangle } from "lucide-react";

export default function TeacherHome() {
    const navigate = useNavigate();
    const stats = getSchoolStats();

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Main Content (col-span-2) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">👨‍🎓</div>
                            <div className="text-xl font-bold">{stats.totalStudents}</div>
                            <div className="text-gray-500 text-sm">Total Students</div>
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">📊</div>
                            <div className="text-xl font-bold">{stats.avgMarks}%</div>
                            <div className="text-gray-500 text-sm">Avg Marks</div>
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 shadow flex flex-col items-center hover:shadow-lg transition">
                            <div className="text-3xl">📅</div>
                            <div className="text-xl font-bold">{stats.avgAttendance}%</div>
                            <div className="text-gray-500 text-sm">Avg Attendance</div>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <PerformanceChart data={performanceTrends} />

                    {/* All Classes Grid */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Your Classes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {classData.map((cls) => {
                                const classStats = stats.classStats.find(
                                    (cs) => cs.className === cls.name
                                );
                                return (
                                    <button
                                        key={cls.id}
                                        onClick={() => navigate(`/teacher/class/${cls.name}`)}
                                        className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition bg-white hover:bg-blue-50"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">
                                                    {cls.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Section {cls.name.split("-")[1]}
                                                </p>
                                            </div>
                                            {classStats?.atRiskCount > 0 && (
                                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                            )}
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {cls.studentCount} students
                                            </div>
                                            <div>Avg {classStats?.avgMarks}%</div>
                                            {classStats?.atRiskCount > 0 && (
                                                <div className="text-red-600 font-semibold">
                                                    ⚠️ {classStats.atRiskCount} at-risk
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Reference & Activity (col-span-1) */}
                <div className="space-y-6">
                    {/* Teacher Activity Feed */}
                    <TeacherActivityFeed activities={teacherActivity} />

                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                            Class Summary
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
