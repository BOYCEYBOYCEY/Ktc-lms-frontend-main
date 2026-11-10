// Homework/Assignment system data
export const homeworkAssignments = [
  {
    id: 1,
    teacherId: 1,
    teacherName: 'Mrs. Sharma',
    subject: 'Mathematics',
    class: '8-A',
    title: 'Algebra Practice - Quadratic Equations',
    description: 'Solve exercises 2.1 to 2.5 from textbook. Show all steps clearly.',
    assignedDate: '2026-11-05',
    dueDate: '2026-11-12',
    totalMarks: 20,
    attachments: ['Algebra_Practice.pdf'],
    status: 'active', // active, closed
  },
  {
    id: 2,
    teacherId: 2,
    teacherName: 'Mr. Kumar',
    subject: 'Science',
    class: '8-A',
    title: 'Cell Structure Diagram',
    description: 'Draw and label plant and animal cell. Color the diagram neatly.',
    assignedDate: '2026-11-06',
    dueDate: '2026-11-13',
    totalMarks: 15,
    attachments: [],
    status: 'active',
  },
  {
    id: 3,
    teacherId: 3,
    teacherName: 'Ms. Verma',
    subject: 'English',
    class: '8-A',
    title: 'Essay Writing - My Hobby',
    description: 'Write a 300-word essay on "My Favourite Hobby". Use proper grammar and punctuation.',
    assignedDate: '2026-11-04',
    dueDate: '2026-11-11',
    totalMarks: 10,
    attachments: [],
    status: 'active',
  },
];

// Student submissions
export const homeworkSubmissions = {
  1: [ // Student ID 1
    {
      homeworkId: 1,
      studentId: 1,
      submittedDate: '2026-11-10',
      files: ['Student1_Algebra.pdf'],
      status: 'submitted', // pending, submitted, graded
      marksObtained: null,
      feedback: null,
    },
    {
      homeworkId: 3,
      studentId: 1,
      submittedDate: '2026-11-09',
      files: ['Student1_Essay.pdf'],
      status: 'graded',
      marksObtained: 9,
      feedback: 'Good work! Improve handwriting.',
    },
  ],
  2: [ // Student ID 2
    {
      homeworkId: 1,
      studentId: 2,
      submittedDate: null,
      files: [],
      status: 'pending',
      marksObtained: null,
      feedback: null,
    },
  ],
};

// Helper to get homework for a class
export const getHomeworkForClass = (className) => {
  return homeworkAssignments.filter(hw => hw.class === className && hw.status === 'active');
};

// Helper to get submissions for a student
export const getSubmissionsForStudent = (studentId) => {
  return homeworkSubmissions[studentId] || [];
};

// Helper to get pending homework for student
export const getPendingHomeworkForStudent = (studentId, className) => {
  const submissions = homeworkSubmissions[studentId] || [];
  const submittedIds = submissions.map(s => s.homeworkId);

  const classHomework = getHomeworkForClass(className);
  return classHomework.filter(hw => !submittedIds.includes(hw.id));
};
