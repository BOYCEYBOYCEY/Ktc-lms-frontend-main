import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import { classData } from "../../data/teachers";

const generateAttendanceForDate = (studentId, date) => {
    const dateParts = date.split("-");
    const dateNum = parseInt(dateParts[0] + dateParts[1] + dateParts[2]);
    const seed = studentId * 1000 + dateNum;
    const random = Math.sin(seed) * 10000;
    const normalized = random - Math.floor(random);

    if (normalized > 0.2) return "Present";
    if (normalized > 0.08) return "Absent";
    return "Holiday";
};

export default function TeacherAttendance() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState("8-A");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [markAs, setMarkAs] = useState("Present");
    const [studentAttendance, setStudentAttendance] = useState({});
    const [saveMessage, setSaveMessage] = useState("");
    const [showSaveAlert, setShowSaveAlert] = useState(false);

    const classStudents = students.filter((s) => s.class === selectedClass);

    // Generate attendance for selected date - recalculates whenever date changes
    const dateAttendance = useMemo(() => {
        const attendance = {};
        classStudents.forEach((student) => {
            attendance[student.id] = generateAttendanceForDate(student.id, selectedDate);
        });
        return attendance;
    }, [selectedDate, selectedClass]);

    // Reset edits when class changes
    useEffect(() => {
        setStudentAttendance({});
    }, [selectedClass]);

    const getCurrentAttendance = (studentId) => {
        if (studentAttendance[studentId] !== undefined) {
            return studentAttendance[studentId];
        }
        return dateAttendance[studentId] || "Present";
    };

    const handleToggleAttendance = (studentId) => {
        const current = getCurrentAttendance(studentId);
        const next = current === "Present" ? "Absent" : current === "Absent" ? "Holiday" : "Present";
        setStudentAttendance((prev) => ({
            ...prev,
            [studentId]: next,
        }));
    };

    const handleMarkAll = () => {
        const newAttendance = {};
        classStudents.forEach((student) => {
            newAttendance[student.id] = markAs;
        });
        setStudentAttendance(newAttendance);
    };

    const handleSave = () => {
        const presentCount = classStudents.filter(
            (s) => getCurrentAttendance(s.id) === "Present"
        ).length;
        const absentCount = classStudents.filter(
            (s) => getCurrentAttendance(s.id) === "Absent"
        ).length;

        setSaveMessage(
            `✅ Attendance saved for ${selectedDate}! ${presentCount} Present, ${absentCount} Absent`
        );
        setShowSaveAlert(true);
        setTimeout(() => setShowSaveAlert(false), 3000);
    };

    const totalPresent = classStudents.filter(
        (s) => getCurrentAttendance(s.id) === "Present"
    ).length;
    const totalAbsent = classStudents.filter(
        (s) => getCurrentAttendance(s.id) === "Absent"
    ).length;
    const totalHoliday = classStudents.filter(
        (s) => getCurrentAttendance(s.id) === "Holiday"
    ).length;
    const attendancePercentage =
        classStudents.length > totalHoliday && totalHoliday < classStudents.length
            ? Math.round((totalPresent / (classStudents.length - totalHoliday)) * 100)
            : 0;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Save Alert */}
            {showSaveAlert && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                    <Check className="w-5 h-5" />
                    <span>{saveMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate("/teacher")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-gray-800">📅 Attendance</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Class: <span className="font-semibold">{selectedClass}</span> | Date: <span className="font-semibold">{selectedDate}</span>
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Class Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Class
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            {classData.map((cls) => (
                                <option key={cls.id} value={cls.name}>
                                    Class {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Mark As Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mark As
                        </label>
                        <select
                            value={markAs}
                            onChange={(e) => setMarkAs(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option>Present</option>
                            <option>Absent</option>
                            <option>Holiday</option>
                            <option>Leave</option>
                        </select>
                    </div>

                    {/* Mark All Button */}
                    <button
                        onClick={handleMarkAll}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Mark All
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm font-semibold">Total Present</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{totalPresent}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm font-semibold">Total Absent</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{totalAbsent}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm font-semibold">Holiday/Leave</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">{totalHoliday}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm font-semibold">Attendance %</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{attendancePercentage}%</p>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Roll No
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Student Name
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classStudents.map((student) => {
                                const status = getCurrentAttendance(student.id);
                                const statusColor =
                                    status === "Present"
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : status === "Absent"
                                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                                        : "bg-blue-100 text-blue-700 hover:bg-blue-200";

                                return (
                                    <tr
                                        key={student.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-3 text-sm text-gray-800">
                                            {student.rollNo}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-800">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => handleToggleAttendance(student.id)}
                                                className={`px-4 py-1 rounded-full text-sm font-semibold transition cursor-pointer ${statusColor}`}
                                                title="Click to cycle: Present → Absent → Holiday → Present"
                                            >
                                                {status}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex gap-3">
                <button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    Save Attendance
                </button>
                <button
                    onClick={() => navigate("/teacher")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
