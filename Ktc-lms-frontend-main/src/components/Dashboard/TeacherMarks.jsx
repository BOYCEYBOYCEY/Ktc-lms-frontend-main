import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import { classData } from "../../data/teachers";
import { marks as marksData } from "../../data/marks";

const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Social Science"];

export default function TeacherMarks() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState("8-A");
    const [selectedSubject, setSelectedSubject] = useState("Mathematics");
    const [examType, setExamType] = useState("Mid-term");
    const [marks, setMarks] = useState({});

    const classStudents = students.filter((s) => s.class === selectedClass);

    const handleMarkChange = (studentId, value) => {
        setMarks((prev) => ({
            ...prev,
            [studentId]: Math.min(100, Math.max(0, parseInt(value) || 0)),
        }));
    };

    const validMarks = Object.values(marks).filter((m) => m > 0).length;
    const avgMarks =
        validMarks > 0
            ? Math.round(
                Object.values(marks).reduce((a, b) => a + b, 0) / validMarks
            )
            : 0;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate("/teacher")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-gray-800">📊 Enter Marks</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Class Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Class
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

                    {/* Subject Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            {SUBJECTS.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Exam Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Exam Type
                        </label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option>Quiz 1</option>
                            <option>Quiz 2</option>
                            <option>Mid-term</option>
                            <option>Final</option>
                            <option>Unit Test</option>
                        </select>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                            <span className="font-semibold">{validMarks}</span> marks entered •
                            <span className="font-semibold ml-1">Avg: {avgMarks}%</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Marks Entry Table */}
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
                                    {selectedSubject} ({examType})
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                    Grade
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classStudents.map((student) => {
                                const studentMarks = marks[student.id] || 0;
                                const grade =
                                    studentMarks >= 90
                                        ? "A+"
                                        : studentMarks >= 80
                                        ? "A"
                                        : studentMarks >= 70
                                        ? "B"
                                        : studentMarks >= 60
                                        ? "C"
                                        : studentMarks >= 50
                                        ? "D"
                                        : "F";
                                const gradeColor =
                                    grade === "A+" || grade === "A"
                                        ? "text-green-600"
                                        : grade === "B"
                                        ? "text-blue-600"
                                        : grade === "C"
                                        ? "text-yellow-600"
                                        : "text-red-600";

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
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={studentMarks || ""}
                                                onChange={(e) =>
                                                    handleMarkChange(student.id, e.target.value)
                                                }
                                                placeholder="--"
                                                className="w-16 p-2 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className={`px-6 py-3 text-center font-semibold ${gradeColor}`}>
                                            {studentMarks > 0 ? grade : "--"}
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
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Save Marks
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
