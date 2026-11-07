// Marks data with subject-wise performance and historical trends
export const marks = {
  // Student 1: Ravi Kumar (Active)
  1: {
    studentId: 1,
    currentMarks: {
      Math: 78,
      Science: 82,
      English: 75,
      Hindi: 80,
      SocialScience: 76,
    },
    previousMarks: {
      Math: 76,
      Science: 80,
      English: 74,
      Hindi: 79,
      SocialScience: 75,
    },
    trend: "stable", // stable, improving, declining
  },
  // Student 2: Priya Sharma (Active)
  2: {
    studentId: 2,
    currentMarks: {
      Math: 92,
      Science: 89,
      English: 91,
      Hindi: 88,
      SocialScience: 90,
    },
    previousMarks: {
      Math: 90,
      Science: 88,
      English: 89,
      Hindi: 87,
      SocialScience: 89,
    },
    trend: "improving",
  },
  // Student 3: Arjun Singh (AT-RISK - Declining marks)
  3: {
    studentId: 3,
    currentMarks: {
      Math: 42,
      Science: 38,
      English: 45,
      Hindi: 40,
      SocialScience: 35,
    },
    previousMarks: {
      Math: 68,
      Science: 65,
      English: 70,
      Hindi: 66,
      SocialScience: 62,
    },
    trend: "declining", // ⚠️ CRITICAL
  },
  // Student 4: Neha Patel (Active)
  4: {
    studentId: 4,
    currentMarks: {
      Math: 85,
      Science: 88,
      English: 84,
      Hindi: 86,
      SocialScience: 85,
    },
    previousMarks: {
      Math: 83,
      Science: 86,
      English: 82,
      Hindi: 84,
      SocialScience: 83,
    },
    trend: "stable",
  },
  // Student 5: Akshay Gupta (AT-RISK - Low performance)
  5: {
    studentId: 5,
    currentMarks: {
      Math: 48,
      Science: 52,
      English: 55,
      Hindi: 50,
      SocialScience: 48,
    },
    previousMarks: {
      Math: 50,
      Science: 54,
      English: 57,
      Hindi: 52,
      SocialScience: 50,
    },
    trend: "declining", // ⚠️
  },
  // Student 6: Zara Khan (Active)
  6: {
    studentId: 6,
    currentMarks: {
      Math: 81,
      Science: 79,
      English: 83,
      Hindi: 77,
      SocialScience: 80,
    },
    previousMarks: {
      Math: 79,
      Science: 77,
      English: 81,
      Hindi: 75,
      SocialScience: 78,
    },
    trend: "improving",
  },
  // Student 7: Kavya Menon (Active, Good)
  7: {
    studentId: 7,
    currentMarks: {
      Math: 95,
      Science: 93,
      English: 94,
      Hindi: 92,
      SocialScience: 93,
    },
    previousMarks: {
      Math: 93,
      Science: 92,
      English: 92,
      Hindi: 91,
      SocialScience: 92,
    },
    trend: "improving",
  },
  // Student 8: Rohan Desai (Active)
  8: {
    studentId: 8,
    currentMarks: {
      Math: 77,
      Science: 80,
      English: 78,
      Hindi: 79,
      SocialScience: 76,
    },
    previousMarks: {
      Math: 76,
      Science: 79,
      English: 77,
      Hindi: 78,
      SocialScience: 75,
    },
    trend: "stable",
  },
  // Student 9: Isha Verma (AT-RISK - Absences + declining)
  9: {
    studentId: 9,
    currentMarks: {
      Math: 55,
      Science: 58,
      English: 52,
      Hindi: 56,
      SocialScience: 54,
    },
    previousMarks: {
      Math: 72,
      Science: 75,
      English: 70,
      Hindi: 73,
      SocialScience: 71,
    },
    trend: "declining", // ⚠️ CRITICAL
  },
  // Student 10: Aditya Malhotra (Active)
  10: {
    studentId: 10,
    currentMarks: {
      Math: 88,
      Science: 86,
      English: 87,
      Hindi: 85,
      SocialScience: 86,
    },
    previousMarks: {
      Math: 86,
      Science: 84,
      English: 85,
      Hindi: 83,
      SocialScience: 84,
    },
    trend: "improving",
  },
  // Student 11: Divya Nair (Active)
  11: {
    studentId: 11,
    currentMarks: {
      Math: 82,
      Science: 84,
      English: 80,
      Hindi: 81,
      SocialScience: 83,
    },
    previousMarks: {
      Math: 80,
      Science: 82,
      English: 78,
      Hindi: 79,
      SocialScience: 81,
    },
    trend: "stable",
  },
  // Student 12: Samir Joshi (AT-RISK - Struggling in all subjects)
  12: {
    studentId: 12,
    currentMarks: {
      Math: 35,
      Science: 38,
      English: 40,
      Hindi: 36,
      SocialScience: 37,
    },
    previousMarks: {
      Math: 58,
      Science: 60,
      English: 62,
      Hindi: 59,
      SocialScience: 58,
    },
    trend: "declining", // ⚠️ CRITICAL
  },
  // Student 13: Esha Das (Active)
  13: {
    studentId: 13,
    currentMarks: {
      Math: 79,
      Science: 81,
      English: 80,
      Hindi: 78,
      SocialScience: 79,
    },
    previousMarks: {
      Math: 77,
      Science: 79,
      English: 78,
      Hindi: 76,
      SocialScience: 77,
    },
    trend: "improving",
  },
  // Student 14: Harsh Reddy (Active)
  14: {
    studentId: 14,
    currentMarks: {
      Math: 84,
      Science: 82,
      English: 85,
      Hindi: 83,
      SocialScience: 84,
    },
    previousMarks: {
      Math: 82,
      Science: 80,
      English: 83,
      Hindi: 81,
      SocialScience: 82,
    },
    trend: "stable",
  },
  // Student 15: Meera Pillai (Active)
  15: {
    studentId: 15,
    currentMarks: {
      Math: 89,
      Science: 91,
      English: 88,
      Hindi: 90,
      SocialScience: 87,
    },
    previousMarks: {
      Math: 87,
      Science: 89,
      English: 86,
      Hindi: 88,
      SocialScience: 85,
    },
    trend: "improving",
  },
};
