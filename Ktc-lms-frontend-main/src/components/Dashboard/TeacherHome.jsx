// resources/js/components/Dashboard/TeacherHome.jsx
import React from "react";

export default function TeacherHome() {
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">📚</div>
                            <div className="text-xl font-bold">5</div>
                            <div className="text-gray-500 text-sm">
                                Subjects Teaching
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">👨‍🎓</div>
                            <div className="text-xl font-bold">180</div>
                            <div className="text-gray-500 text-sm">
                                Total Students
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">📝</div>
                            <div className="text-xl font-bold">12</div>
                            <div className="text-gray-500 text-sm">
                                Assignments Pending
                            </div>
                        </div>
                    </div>

                    {/* Recent Classes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Upcoming Classes
                            </h2>
                            <button className="text-purple-600 text-sm">
                                See all...
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    subject: "Mathematics",
                                    topic: "Trigonometry",
                                    time: "09:00 AM, Wed",
                                },
                                {
                                    subject: "Physics",
                                    topic: "Chapter 2: Motion",
                                    time: "11:00 AM, Wed",
                                },
                                {
                                    subject: "Chemistry",
                                    topic: "Organic Basics",
                                    time: "02:00 PM, Wed",
                                },
                            ].map((cls, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 rounded border-l-4 border-blue-500"
                                >
                                    <p className="font-medium">
                                        {cls.subject} – {cls.topic}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {cls.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assignments To Review */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Assignments to Review
                            </h2>
                            <button className="text-purple-600 text-sm">
                                See all...
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    title: "Math Assignment - Algebra",
                                    submissions: "45 submissions",
                                    due: "Due: Aug 10",
                                },
                                {
                                    title: "Physics Lab Report",
                                    submissions: "30 submissions",
                                    due: "Due: Aug 12",
                                },
                                {
                                    title: "Chemistry Project",
                                    submissions: "50 submissions",
                                    due: "Due: Aug 15",
                                },
                            ].map((task, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 rounded flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {task.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {task.submissions} | {task.due}
                                        </p>
                                    </div>
                                    <button className="text-sm text-white bg-purple-600 px-3 py-1 rounded hover:bg-purple-700">
                                        Review
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Sidebar */}
                <div className="space-y-6">
                    {/* Student Performance Alerts */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Student Alerts
                        </h2>
                        <div className="space-y-3">
                            {[
                                {
                                    name: "Rohit Sharma",
                                    issue: "Low attendance (65%)",
                                },
                                {
                                    name: "Ananya Singh",
                                    issue: "Consistently late submissions",
                                },
                                {
                                    name: "Vikram Patel",
                                    issue: "Needs help in Physics",
                                },
                            ].map((alert, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 rounded border-l-4 border-red-500"
                                >
                                    <p className="font-medium">{alert.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {alert.issue}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Messages from Admin */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Messages from Admin
                            </h2>
                            <button className="text-purple-600 text-sm">
                                See all...
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    msg: "Submit monthly attendance report.",
                                    time: "02:00 PM, Tue",
                                },
                                {
                                    msg: "Prepare syllabus for mid-term exams.",
                                    time: "11:00 AM, Mon",
                                },
                            ].map((note, i) => (
                                <div
                                    key={i}
                                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">
                                            {note.msg}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {note.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
