// Generate marks for all students
const generateMarks = (studentId, isAtRisk) => {
  if (isAtRisk) {
    return {
      studentId,
      currentMarks: {
        Math: 35 + Math.random() * 20,
        Science: 32 + Math.random() * 18,
        English: 38 + Math.random() * 22,
        Hindi: 34 + Math.random() * 19,
        SocialScience: 30 + Math.random() * 20,
      },
      previousMarks: {
        Math: 65 + Math.random() * 10,
        Science: 62 + Math.random() * 10,
        English: 68 + Math.random() * 10,
        Hindi: 64 + Math.random() * 10,
        SocialScience: 60 + Math.random() * 10,
      },
      trend: "declining",
    };
  }
  
  return {
    studentId,
    currentMarks: {
      Math: 70 + Math.random() * 25,
      Science: 68 + Math.random() * 27,
      English: 72 + Math.random() * 23,
      Hindi: 70 + Math.random() * 25,
      SocialScience: 69 + Math.random() * 26,
    },
    previousMarks: {
      Math: 68 + Math.random() * 25,
      Science: 67 + Math.random() * 27,
      English: 71 + Math.random() * 23,
      Hindi: 69 + Math.random() * 25,
      SocialScience: 68 + Math.random() * 26,
    },
    trend: Math.random() > 0.7 ? "improving" : "stable",
  };
};

export const marks = {};
for (let i = 1; i <= 465; i++) {
  const isAtRisk = i <= 45 ? i < 3 : i <= 94 ? i < 49 : i <= 138 ? i < 96 : i <= 185 ? i < 141 : i <= 231 ? i < 188 : i <= 281 ? i < 234 : i <= 326 ? false : i <= 373 ? false : i <= 416 ? i < 418 : false;
  marks[i] = generateMarks(i, isAtRisk);
}
