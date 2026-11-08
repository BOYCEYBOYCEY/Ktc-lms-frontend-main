import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { classData } from "../../data/teachers";
import { getAtRiskStudents, getClassStats } from "../../lib/dataHelpers";
import { AlertTriangle, Users, CheckCircle, Clock, BookOpen, Zap } from "lucide-react";

export default function TeacherHome() {
    const navigate = useNavigate();
    const [completedTasks, setCompletedTasks] = useState({});
    const atRiskStudents = getAtRiskStudents();
    const classStatsData = classData.map((cls) => getClassStats(cls.name));

    const todaysTasks = [
        { id: 1, title: "Mark attendance for Class 8-A", class: "8-A", type: "attendance", pending: true },
        { id: 2, title: "Enter marks for Quiz 1", class: "8-B", type: "marks", pending: true },
        { id: 3, title: "Check 3 at-risk students", class: "General", type: "intervention", pending: true },
        { id: 4, title: "Reviewed assignments", class: "9-A", type: "assignment", pending: false },
    ];

    const toggleTask = (taskId) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const getTaskIcon = (type) => {
        switch (type) {
            case "attendance": return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "marks": return <BookOpen className="w-4 h-4 text-blue-600" />;
            case "intervention": return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case "assignment": return <CheckCircle className="w-4 h-4 text-purple-600" />;
            default: return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => navigate("/teacher/attendance")}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow hover:shadow-lg transition hover:scale-105"
                >
                    <CheckCircle className="w-6 h-6 mb-2" />
                    <p className="font-semibold text-sm">Mark Attendance</p>
                    <p className="text-xs opacity-90">Quick marking</p>
                </button>
                <button
                    onClick={() => navigate("/teacher/marks")}
                    className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow hover:shadow-lg transition hover:scale-105"
                >
                    <BookOpen className="w-6 h-6 mb-2" />
                    <p className="font-semibold text-sm">Enter Marks</p>
                    <p className="text-xs opacity-90">Update grades</p>
                </button>
                <button
                    onClick={() => navigate("/teacher/ai-tools")}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow hover:shadow-lg transition hover:scale-105"
                >
                    <Zap className="w-6 h-6 mb-2" />
                    <p className="font-semibold text-sm">AI Tools</p>
                    <p className="text-xs opacity-90">Lesson plan, quiz</p>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Main Content (col-span-2) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* My Classes Grid */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Your Classes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {classData.map((cls) => {
                                const stats = classStatsData.find((cs) => cs.className === cls.name);
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
                                            {stats?.atRiskCount > 0 && (
                                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                            )}
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {cls.studentCount} students
                                            </div>
                                            <div>Avg {stats?.avgMarks}%</div>
                                            {stats?.atRiskCount > 0 && (
                                                <div className="text-red-600 font-semibold">
                                                    ⚠️ {stats.atRiskCount} at-risk
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* At-Risk Students Alert */}
                    {atRiskStudents.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                                <h2 className="text-lg font-bold text-red-700">
                                    {atRiskStudents.length} Students Need Intervention
                                </h2>
                            </div>
                            <div className="space-y-2">
                                {atRiskStudents.slice(0, 3).map((s) => (
                                    <div key={s.id} className="text-sm text-red-700">
                                        • <span className="font-semibold">{s.name}</span> ({s.class}) - {s.reasons[0]}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate("/teacher/at-risk-list")}
                                className="mt-3 text-sm text-red-600 hover:text-red-700 font-semibold hover:underline"
                            >
                                View all →
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: Today's Tasks */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Today's Tasks
                        </h3>
                        <div className="space-y-3">
                            {todaysTasks.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition flex items-start gap-3 ${
                                        completedTasks[task.id] || !task.pending
                                            ? "bg-gray-50 border-gray-200 opacity-60"
                                            : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={completedTasks[task.id] || !task.pending}
                                        onChange={() => {}}
                                        className="mt-1 w-4 h-4"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${completedTasks[task.id] || !task.pending ? "line-through text-gray-500" : "text-gray-800"}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{task.class}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
