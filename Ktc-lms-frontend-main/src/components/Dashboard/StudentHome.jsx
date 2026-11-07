// StudentHome.jsx
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function StudentHome() {
    // Dummy data for Test Performance
    const testData = [
        { name: "CT-1", marks: 80 },
        { name: "CT-2", marks: 70 },
        { name: "CT-3", marks: 68 },
        { name: "CT-4", marks: 85 },
    ];

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">🏆</div>
                            <div className="text-xl font-bold">02</div>
                            <div className="text-gray-500 text-sm">
                                Class Rank
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">📊</div>
                            <div className="text-xl font-bold">98%</div>
                            <div className="text-gray-500 text-sm">
                                Attendance
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">🎯</div>
                            <div className="text-xl font-bold">5+</div>
                            <div className="text-gray-500 text-sm">
                                Achievements
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
                            <div className="text-3xl">⭐</div>
                            <div className="text-xl font-bold">A+</div>
                            <div className="text-gray-500 text-sm">
                                Performance
                            </div>
                        </div>
                    </div>

                    {/* Test Performance */}
                    <div className="bg-white rounded-lg p-6 shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Test Performance
                            </h2>
                            <button className="text-purple-600 text-sm">
                                See all...
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">
                                540/600{" "}
                                <span className="text-gray-500 text-sm">
                                    Total Mark
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Grade: <span className="font-bold">A+</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Percentage:{" "}
                                <span className="font-bold">90%</span>
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={testData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="marks" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Classes */}
                    <div className="bg-white rounded-lg p-6 shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Recent Classes
                            </h2>
                            <button className="text-purple-600 text-sm">
                                See all...
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded shadow">
                                <p className="font-medium">Trigonometry</p>
                                <p className="text-sm text-gray-500">Math</p>
                                <p className="text-xs text-gray-400">
                                    02:00 PM, Wed
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded shadow">
                                <p className="font-medium">
                                    Chapter 2 | Lights
                                </p>
                                <p className="text-sm text-gray-500">Physics</p>
                                <p className="text-xs text-gray-400">
                                    02:30 PM, Wed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Classes */}
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
                                    time: "09:00 AM – 10:00 AM",
                                    subject: "Mathematics",
                                    teacher: "Theresa Webb",
                                },
                                {
                                    time: "10:00 AM – 11:00 AM",
                                    subject: "Science",
                                    teacher: "Dianne Russell",
                                },
                                {
                                    time: "11:10 AM – 12:10 PM",
                                    subject: "English",
                                    teacher: "Floyd Miles",
                                },
                            ].map((cls, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 rounded border-l-4 border-green-500"
                                >
                                    <p className="font-medium">{cls.subject}</p>
                                    <p className="text-sm text-gray-500">
                                        {cls.teacher}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {cls.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notice Board */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Notice Board
                            </h2>
                            <button className="text-purple-600 text-sm">
                                See all...
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    msg: "Submit the mathematics assignment",
                                    time: "02:00 PM, Wed",
                                },
                                {
                                    msg: "All student take review task.",
                                    time: "01:10 PM, Wed",
                                },
                                {
                                    msg: "Make assignments on any topic",
                                    time: "05:00 PM, Wed",
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
