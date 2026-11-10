import React, { useState } from 'react';
import { BookOpen, Calendar, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getHomeworkForClass, getSubmissionsForStudent, getPendingHomeworkForStudent } from '../../data/homework';
import { useAuth } from '../../context/AuthContext';
import { students } from '../../data/students';

const StudentHomework = () => {
  const { user } = useAuth();

  // For demo, map user to a student (in production, user.id would map to student.id)
  const student = students.find(s => s.id === (user?.id || 1)) || students[0];
  const [selectedTab, setSelectedTab] = useState('pending'); // pending, submitted, graded
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);

  const pendingHomework = getPendingHomeworkForStudent(student.id, student.class);
  const submissions = getSubmissionsForStudent(student.id);
  const submittedWork = submissions.filter(s => s.status === 'submitted');
  const gradedWork = submissions.filter(s => s.status === 'graded');

  const handleSubmit = (homework) => {
    setSelectedHomework(homework);
    setShowSubmitModal(true);
  };

  const getStatusBadge = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Overdue</span>;
    if (daysLeft <= 2) return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Due Soon</span>;
    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">{daysLeft} days left</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" />
              My Homework
            </h2>
            <p className="text-gray-600 mt-1">Complete and submit your assignments on time</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{pendingHomework.length}</p>
            <p className="text-sm text-gray-600">Pending Tasks</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            selectedTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingHomework.length})
        </button>
        <button
          onClick={() => setSelectedTab('submitted')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            selectedTab === 'submitted'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Submitted ({submittedWork.length})
        </button>
        <button
          onClick={() => setSelectedTab('graded')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            selectedTab === 'graded'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Graded ({gradedWork.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Pending Homework */}
        {selectedTab === 'pending' && (
          pendingHomework.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No pending homework! 🎉</p>
              <p className="text-sm text-gray-500 mt-1">You're all caught up</p>
            </div>
          ) : (
            pendingHomework.map(homework => (
              <div key={homework.id} className="bg-white border rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {homework.subject}
                      </span>
                      {getStatusBadge(homework.dueDate)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{homework.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{homework.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(homework.dueDate).toLocaleDateString('en-IN')}
                      </span>
                      <span>By: {homework.teacherName}</span>
                      <span>Marks: {homework.totalMarks}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubmit(homework)}
                    className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {/* Submitted Homework */}
        {selectedTab === 'submitted' && (
          submittedWork.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No submitted homework yet</p>
            </div>
          ) : (
            submittedWork.map((submission, idx) => {
              const homework = [...getHomeworkForClass(student.class)].find(h => h.id === submission.homeworkId);
              return (
                <div key={idx} className="bg-white border rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Awaiting Review
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{homework?.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Submitted on: {new Date(submission.submittedDate).toLocaleDateString('en-IN')}</p>
                  <p className="text-sm text-gray-500">Files: {submission.files.join(', ')}</p>
                </div>
              );
            })
          )
        )}

        {/* Graded Homework */}
        {selectedTab === 'graded' && (
          gradedWork.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No graded homework yet</p>
            </div>
          ) : (
            gradedWork.map((submission, idx) => {
              const homework = [...getHomeworkForClass(student.class)].find(h => h.id === submission.homeworkId);
              return (
                <div key={idx} className="bg-white border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Graded
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {submission.marksObtained}/{homework?.totalMarks}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{homework?.title}</h3>
                  {submission.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Teacher's Feedback:</p>
                      <p className="text-sm text-gray-600">{submission.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })
          )
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && selectedHomework && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Submit Homework</h3>
            <p className="text-gray-600 mb-4">{selectedHomework.title}</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, or images (Max 10MB)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Homework submitted successfully!');
                  setShowSubmitModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHomework;
