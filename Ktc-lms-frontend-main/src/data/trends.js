// Performance and attendance trends for charting
export const performanceTrends = [
  {
    week: "Week 1",
    "8-A": 78,
    "8-B": 75,
    "9-A": 82,
  },
  {
    week: "Week 2",
    "8-A": 76,
    "8-B": 74,
    "9-A": 83,
  },
  {
    week: "Week 3",
    "8-A": 72,
    "8-B": 71,
    "9-A": 85,
  },
  {
    week: "Week 4",
    "8-A": 68, // declining
    "8-B": 69, // declining
    "9-A": 87,
  },
];

export const attendanceTrends = [
  {
    week: "Week 1",
    attendance: 92,
  },
  {
    week: "Week 2",
    attendance: 91,
  },
  {
    week: "Week 3",
    attendance: 88, // dip
  },
  {
    week: "Week 4",
    attendance: 85, // low
  },
];

// Teacher activity log
export const teacherActivity = [
  {
    id: 1,
    teacher: "Dr. Rajesh Kumar",
    subject: "Mathematics",
    action: "Marked attendance for Class 8-A",
    time: "10:30 AM",
    class: "8-A",
    timestamp: new Date(Date.now() - 30 * 60000), // 30 mins ago
  },
  {
    id: 2,
    teacher: "Mrs. Priya Saxena",
    subject: "Science",
    action: "Entered marks for Mid-term exam",
    time: "09:45 AM",
    class: "8-B",
    timestamp: new Date(Date.now() - 75 * 60000), // 75 mins ago
  },
  {
    id: 3,
    teacher: "Mr. Vikram Joshi",
    subject: "English",
    action: "Created new assignment",
    time: "09:15 AM",
    class: "9-A",
    timestamp: new Date(Date.now() - 105 * 60000), // 105 mins ago
  },
  {
    id: 4,
    teacher: "Mrs. Sneha Gupta",
    subject: "Class Incharge",
    action: "Submitted attendance report",
    time: "08:30 AM",
    class: "8-A",
    timestamp: new Date(Date.now() - 190 * 60000), // 3+ hours ago
  },
  {
    id: 5,
    teacher: "Mr. Ashok Sharma",
    subject: "Social Science",
    action: "Updated class syllabus",
    time: "Yesterday 3:30 PM",
    class: "8-A, 8-B",
    timestamp: new Date(Date.now() - 20.5 * 60 * 60000), // yesterday
  },
];
