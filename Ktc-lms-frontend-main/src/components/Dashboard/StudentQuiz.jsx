import React, { useState, useEffect } from 'react';
import { Brain, Clock, Trophy, CheckCircle, XCircle, Award } from 'lucide-react';
import { getQuizzesForClass, getStudentQuizAttempts, getQuizLeaderboard } from '../../data/quizzes';

const StudentQuiz = ({ student }) => {
  const [selectedTab, setSelectedTab] = useState('available'); // available, completed, leaderboard
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const availableQuizzes = getQuizzesForClass(student.class);
  const completedAttempts = getStudentQuizAttempts(student.id).filter(a => a.status === 'completed');

  // Timer
  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, activeQuiz, quizCompleted]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(quiz.duration * 60);
    setQuizCompleted(false);
    setResults(null);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (q.type === 'mcq' && answers[idx] === q.correctAnswer) {
        score += q.marks;
      } else if (q.type === 'true-false' && answers[idx] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const percentage = (score / activeQuiz.totalMarks) * 100;
    setResults({
      marksObtained: score,
      totalMarks: activeQuiz.totalMarks,
      percentage: percentage.toFixed(2),
      passed: score >= activeQuiz.passingMarks,
    });
    setQuizCompleted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeQuiz && !quizCompleted) {
    const question = activeQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activeQuiz.title}</h2>
              <p className="text-purple-100 mt-1">{activeQuiz.subject} - {activeQuiz.class}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-3xl font-bold">
                <Clock className="w-8 h-8" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-purple-100">Time Remaining</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex-1">{question.question}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ml-4">
              {question.marks} marks
            </span>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.type === 'mcq' && question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestion] === idx
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    answers[currentQuestion] === idx ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === idx && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}

            {question.type === 'true-false' && ['True', 'False'].map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx === 0)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestion] === (idx === 0)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    answers[currentQuestion] === (idx === 0) ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === (idx === 0) && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium"
          >
            Previous
          </button>

          {currentQuestion === activeQuiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-lg p-8 text-center ${results.passed ? 'bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300' : 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300'}`}>
          {results.passed ? (
            <Trophy className="w-20 h-20 text-green-600 mx-auto mb-4" />
          ) : (
            <Brain className="w-20 h-20 text-orange-600 mx-auto mb-4" />
          )}

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {results.passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {results.passed ? 'You passed the quiz!' : 'You need more practice. Review and try again.'}
          </p>

          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {results.marksObtained}/{results.totalMarks}
            </div>
            <p className="text-2xl font-semibold text-gray-700">{results.percentage}%</p>
          </div>

          <button
            onClick={() => setActiveQuiz(null)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-7 h-7 text-purple-600" />
              Quizzes & Tests
            </h2>
            <p className="text-gray-600 mt-1">Test your knowledge and track your progress</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('available')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            selectedTab === 'available' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'
          }`}
        >
          Available ({availableQuizzes.length})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            selectedTab === 'completed' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'
          }`}
        >
          Completed ({completedAttempts.length})
        </button>
        <button
          onClick={() => setSelectedTab('leaderboard')}
          className={`px-4 py-2 font-medium transition border-b-2 ${
            selectedTab === 'leaderboard' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-1" />
          Leaderboard
        </button>
      </div>

      {/* Available Quizzes */}
      {selectedTab === 'available' && (
        <div className="grid gap-4">
          {availableQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {quiz.subject}
                    </span>
                    <span className="text-sm text-gray-500">by {quiz.teacherName}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.duration} min
                    </span>
                    <span>{quiz.questions.length} questions</span>
                    <span>{quiz.totalMarks} marks</span>
                  </div>
                </div>
                <button
                  onClick={() => startQuiz(quiz)}
                  className="ml-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed */}
      {selectedTab === 'completed' && (
        <div className="grid gap-4">
          {completedAttempts.map((attempt, idx) => {
            const quiz = availableQuizzes.find(q => q.id === attempt.quizId);
            return (
              <div key={idx} className="bg-white border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{quiz?.title}</h3>
                    <p className="text-sm text-gray-600">Completed on {new Date(attempt.attemptDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {attempt.marksObtained}/{attempt.totalMarks}
                    </div>
                    <div className="text-sm text-gray-600">{attempt.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard */}
      {selectedTab === 'leaderboard' && availableQuizzes.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Top Performers
          </h3>
          {availableQuizzes.map(quiz => {
            const leaderboard = getQuizLeaderboard(quiz.id);
            if (leaderboard.length === 0) return null;

            return (
              <div key={quiz.id} className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">{quiz.title}</h4>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
                      idx === 0 ? 'bg-yellow-50 border border-yellow-200' :
                      idx === 1 ? 'bg-gray-50 border border-gray-200' :
                      idx === 2 ? 'bg-orange-50 border border-orange-200' :
                      'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg w-6">#{idx + 1}</span>
                        <span className="font-medium">Student {entry.studentId}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{entry.marksObtained} marks</div>
                        <div className="text-xs text-gray-500">{entry.timeTaken} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;
