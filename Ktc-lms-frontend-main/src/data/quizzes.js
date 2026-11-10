// Quiz system data
export const quizzes = [
  {
    id: 1,
    teacherId: 1,
    teacherName: 'Mrs. Sharma',
    subject: 'Mathematics',
    class: '8-A',
    title: 'Algebra Basics Quiz',
    description: 'Test your understanding of basic algebra concepts',
    duration: 30, // minutes
    totalMarks: 20,
    passingMarks: 12,
    startDate: '2026-11-08T10:00:00',
    endDate: '2026-11-15T23:59:00',
    status: 'active', // draft, active, completed
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the value of x in: 2x + 5 = 15?',
        options: ['5', '10', '7.5', '20'],
        correctAnswer: 0, // index
        marks: 2,
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Simplify: 3(x + 2)',
        options: ['3x + 2', '3x + 6', 'x + 6', '3x + 5'],
        correctAnswer: 1,
        marks: 2,
      },
      {
        id: 3,
        type: 'true-false',
        question: 'The equation x² = 25 has only one solution.',
        correctAnswer: false,
        marks: 1,
      },
      {
        id: 4,
        type: 'mcq',
        question: 'Which of these is a quadratic equation?',
        options: ['x + 5 = 0', '2x² + 3x + 1 = 0', 'x³ + 2 = 0', '5x = 10'],
        correctAnswer: 1,
        marks: 2,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'In algebra, like terms can be added together.',
        correctAnswer: true,
        marks: 1,
      },
    ],
  },
  {
    id: 2,
    teacherId: 2,
    teacherName: 'Mr. Kumar',
    subject: 'Science',
    class: '8-A',
    title: 'Cell Biology Quiz',
    description: 'Quick quiz on cell structure and functions',
    duration: 20,
    totalMarks: 15,
    passingMarks: 9,
    startDate: '2026-11-09T10:00:00',
    endDate: '2026-11-16T23:59:00',
    status: 'active',
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Which organelle is called the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
        correctAnswer: 1,
        marks: 2,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Plant cells have a cell wall.',
        correctAnswer: true,
        marks: 1,
      },
      {
        id: 3,
        type: 'mcq',
        question: 'What is the function of chloroplast?',
        options: ['Respiration', 'Photosynthesis', 'Protein synthesis', 'Storage'],
        correctAnswer: 1,
        marks: 2,
      },
    ],
  },
];

// Student quiz attempts
export const quizAttempts = {
  1: [ // Student ID 1
    {
      quizId: 1,
      studentId: 1,
      attemptDate: '2026-11-08T11:30:00',
      answers: [0, 1, true, 1, true], // Student's answers
      marksObtained: 18,
      totalMarks: 20,
      percentage: 90,
      timeTaken: 25, // minutes
      status: 'completed',
    },
    {
      quizId: 2,
      studentId: 1,
      attemptDate: '2026-11-09T12:00:00',
      answers: [1, true, 1],
      marksObtained: 13,
      totalMarks: 15,
      percentage: 86.67,
      timeTaken: 15,
      status: 'completed',
    },
  ],
  2: [ // Student ID 2
    {
      quizId: 1,
      studentId: 2,
      attemptDate: null,
      answers: [],
      marksObtained: null,
      totalMarks: 20,
      percentage: null,
      timeTaken: null,
      status: 'pending',
    },
  ],
};

// Leaderboard calculation
export const getQuizLeaderboard = (quizId) => {
  const attempts = [];

  Object.keys(quizAttempts).forEach(studentId => {
    const studentAttempts = quizAttempts[studentId];
    const attempt = studentAttempts.find(a => a.quizId === quizId && a.status === 'completed');
    if (attempt) {
      attempts.push({
        studentId: parseInt(studentId),
        marksObtained: attempt.marksObtained,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
      });
    }
  });

  // Sort by marks (desc), then by time (asc)
  attempts.sort((a, b) => {
    if (b.marksObtained !== a.marksObtained) {
      return b.marksObtained - a.marksObtained;
    }
    return a.timeTaken - b.timeTaken;
  });

  return attempts;
};

// Get quizzes for a class
export const getQuizzesForClass = (className) => {
  return quizzes.filter(q => q.class === className && q.status === 'active');
};

// Get student's quiz attempts
export const getStudentQuizAttempts = (studentId) => {
  return quizAttempts[studentId] || [];
};
