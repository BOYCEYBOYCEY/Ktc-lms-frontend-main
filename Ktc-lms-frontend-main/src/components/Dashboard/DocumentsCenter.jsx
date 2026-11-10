import React, { useState } from 'react';
import { FileText, IdCard, Award, Download, Users, GraduationCap } from 'lucide-react';
import { generateReportCard, generateIDCard, generateAdmitCard } from '../../lib/documentGenerators';
import { students } from '../../data/students';
import { marks, attendance } from '../../data/marks';

const DocumentsCenter = () => {
  const [selectedType, setSelectedType] = useState('report-card');
  const [selectedClass, setSelectedClass] = useState('8-A');
  const [generating, setGenerating] = useState(false);

  const classes = ['8-A', '8-B', '9-A'];

  const handleGenerateReportCard = (student) => {
    setGenerating(true);
    const studentMarks = marks[student.id]?.currentMarks || {};
    const studentAttendance = attendance[student.id] || 85;

    const result = generateReportCard(student, studentMarks, studentAttendance);

    if (result.success) {
      alert(`✅ Report Card generated: ${result.filename}`);
    } else {
      alert(`❌ Failed: ${result.error}`);
    }
    setGenerating(false);
  };

  const handleGenerateIDCard = (student) => {
    setGenerating(true);
    const result = generateIDCard(student, 'student');

    if (result.success) {
      alert(`✅ ID Card generated: ${result.filename}`);
    } else {
      alert(`❌ Failed: ${result.error}`);
    }
    setGenerating(false);
  };

  const handleGenerateAdmitCard = (student) => {
    setGenerating(true);
    const result = generateAdmitCard(student);

    if (result.success) {
      alert(`✅ Admit Card generated: ${result.filename}`);
    } else {
      alert(`❌ Failed: ${result.error}`);
    }
    setGenerating(false);
  };

  const handleBulkGenerate = () => {
    const classStudents = students.filter(s => s.class === selectedClass);

    if (window.confirm(`Generate ${selectedType} for ${classStudents.length} students in ${selectedClass}?`)) {
      setGenerating(true);
      let successCount = 0;

      classStudents.forEach(student => {
        if (selectedType === 'report-card') {
          const result = generateReportCard(student, marks[student.id]?.currentMarks || {}, attendance[student.id] || 85);
          if (result.success) successCount++;
        } else if (selectedType === 'id-card') {
          const result = generateIDCard(student, 'student');
          if (result.success) successCount++;
        } else if (selectedType === 'admit-card') {
          const result = generateAdmitCard(student);
          if (result.success) successCount++;
        }
      });

      alert(`✅ Generated ${successCount}/${classStudents.length} documents!`);
      setGenerating(false);
    }
  };

  const classStudents = students.filter(s => s.class === selectedClass).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-indigo-600" />
              Documents Center
            </h2>
            <p className="text-gray-600 mt-1">Generate school documents in bulk or individually</p>
          </div>
        </div>
      </div>

      {/* Document Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedType('report-card')}
          className={`p-6 rounded-lg border-2 transition ${
            selectedType === 'report-card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white hover:border-indigo-300'
          }`}
        >
          <GraduationCap className={`w-10 h-10 mx-auto mb-3 ${selectedType === 'report-card' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 text-center">Report Cards</h3>
          <p className="text-sm text-gray-600 text-center mt-1">Term reports with marks & grades</p>
        </button>

        <button
          onClick={() => setSelectedType('id-card')}
          className={`p-6 rounded-lg border-2 transition ${
            selectedType === 'id-card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white hover:border-indigo-300'
          }`}
        >
          <IdCard className={`w-10 h-10 mx-auto mb-3 ${selectedType === 'id-card' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 text-center">ID Cards</h3>
          <p className="text-sm text-gray-600 text-center mt-1">Student identification cards</p>
        </button>

        <button
          onClick={() => setSelectedType('admit-card')}
          className={`p-6 rounded-lg border-2 transition ${
            selectedType === 'admit-card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white hover:border-indigo-300'
          }`}
        >
          <Award className={`w-10 h-10 mx-auto mb-3 ${selectedType === 'admit-card' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 text-center">Admit Cards</h3>
          <p className="text-sm text-gray-600 text-center mt-1">Exam hall admission cards</p>
        </button>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Select Class</h3>
          <button
            onClick={handleBulkGenerate}
            disabled={generating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Bulk Generate for {selectedClass}
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedClass === cls
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Student List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 mb-3">Students (Showing first 10)</h4>
          {classStudents.map(student => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">Roll No: {student.rollNo} | Admission: {student.admissionNo}</p>
              </div>
              <button
                onClick={() => {
                  if (selectedType === 'report-card') handleGenerateReportCard(student);
                  else if (selectedType === 'id-card') handleGenerateIDCard(student);
                  else if (selectedType === 'admit-card') handleGenerateAdmitCard(student);
                }}
                disabled={generating}
                className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsCenter;
