import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Circle } from 'lucide-react';
import { getSyllabusForClass, getChapterProgress } from '../../data/syllabus';

const SyllabusTracker = ({ student }) => {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const syllabus = getSyllabusForClass(student.class);
  const subjects = Object.keys(syllabus);

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Syllabus not available for this class</p>
      </div>
    );
  }

  const subjectData = syllabus[selectedSubject];
  const progress = getChapterProgress(student.class, selectedSubject);

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'in-progress') return <Clock className="w-5 h-5 text-blue-600" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>;
    if (status === 'in-progress') return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">In Progress</span>;
    return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Not Started</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-green-600" />
              Syllabus Progress
            </h2>
            <p className="text-gray-600 mt-1">Track your curriculum completion</p>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              selectedSubject === subject
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Overall Progress</h3>
            <span className="text-3xl font-bold text-green-600">{progress.percentage}%</span>
          </div>

          <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{progress.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{progress.total - progress.completed - progress.inProgress}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-900">Chapters</h3>
        </div>
        <div className="divide-y">
          {subjectData.chapters.map((chapter, idx) => (
            <div
              key={chapter.id}
              className={`p-4 transition ${
                chapter.status === 'completed' ? 'bg-green-50' :
                chapter.status === 'in-progress' ? 'bg-blue-50' :
                'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getStatusIcon(chapter.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-700">Chapter {chapter.id}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-bold text-gray-900">{chapter.name}</span>
                    </div>
                    {chapter.completedDate && (
                      <p className="text-sm text-gray-600">
                        Completed on {new Date(chapter.completedDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
                <div>{getStatusBadge(chapter.status)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyllabusTracker;
