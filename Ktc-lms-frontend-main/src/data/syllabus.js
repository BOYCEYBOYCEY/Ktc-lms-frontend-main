// Syllabus tracker data
export const syllabus = {
  '8-A': {
    Mathematics: {
      chapters: [
        { id: 1, name: 'Rational Numbers', status: 'completed', completedDate: '2026-07-15' },
        { id: 2, name: 'Linear Equations in One Variable', status: 'completed', completedDate: '2026-08-20' },
        { id: 3, name: 'Understanding Quadrilaterals', status: 'in-progress', completedDate: null },
        { id: 4, name: 'Practical Geometry', status: 'not-started', completedDate: null },
        { id: 5, name: 'Data Handling', status: 'not-started', completedDate: null },
        { id: 6, name: 'Squares and Square Roots', status: 'not-started', completedDate: null },
        { id: 7, name: 'Cubes and Cube Roots', status: 'not-started', completedDate: null },
        { id: 8, name: 'Comparing Quantities', status: 'not-started', completedDate: null },
        { id: 9, name: 'Algebraic Expressions', status: 'not-started', completedDate: null },
        { id: 10, name: 'Visualizing Solid Shapes', status: 'not-started', completedDate: null },
      ],
      progress: 25, // percentage
    },
    Science: {
      chapters: [
        { id: 1, name: 'Crop Production and Management', status: 'completed', completedDate: '2026-07-10' },
        { id: 2, name: 'Microorganisms', status: 'completed', completedDate: '2026-08-05' },
        { id: 3, name: 'Synthetic Fibres and Plastics', status: 'completed', completedDate: '2026-09-12' },
        { id: 4, name: 'Materials: Metals and Non-Metals', status: 'in-progress', completedDate: null },
        { id: 5, name: 'Coal and Petroleum', status: 'not-started', completedDate: null },
        { id: 6, name: 'Combustion and Flame', status: 'not-started', completedDate: null },
        { id: 7, name: 'Conservation of Plants and Animals', status: 'not-started', completedDate: null },
        { id: 8, name: 'Cell Structure and Functions', status: 'not-started', completedDate: null },
      ],
      progress: 37.5,
    },
    English: {
      chapters: [
        { id: 1, name: 'The Best Christmas Present', status: 'completed', completedDate: '2026-07-20' },
        { id: 2, name: 'The Tsunami', status: 'completed', completedDate: '2026-08-15' },
        { id: 3, name: 'Glimpses of the Past', status: 'in-progress', completedDate: null },
        { id: 4, name: 'Bepin Choudhury's Lapse of Memory', status: 'not-started', completedDate: null },
        { id: 5, name: 'The Summit Within', status: 'not-started', completedDate: null },
      ],
      progress: 40,
    },
  },
};

// Get syllabus for a class
export const getSyllabusForClass = (className) => {
  return syllabus[className] || {};
};

// Get chapter progress for a subject
export const getChapterProgress = (className, subject) => {
  const classSyllabus = syllabus[className];
  if (!classSyllabus || !classSyllabus[subject]) return null;

  const chapters = classSyllabus[subject].chapters;
  const completed = chapters.filter(ch => ch.status === 'completed').length;
  const total = chapters.length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    inProgress: chapters.filter(ch => ch.status === 'in-progress').length,
  };
};
