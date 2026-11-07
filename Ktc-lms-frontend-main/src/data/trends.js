// Performance and attendance trends - 8 weeks of data for better story
export const performanceTrends = [
  { week: "Week 1", "8-A": 78, "8-B": 75, "9-A": 82, "10-A": 84, "10-B": 80 },
  { week: "Week 2", "8-A": 76, "8-B": 74, "9-A": 83, "10-A": 85, "10-B": 81 },
  { week: "Week 3", "8-A": 72, "8-B": 71, "9-A": 85, "10-A": 86, "10-B": 82 },
  { week: "Week 4", "8-A": 68, "8-B": 69, "9-A": 87, "10-A": 87, "10-B": 83 },
  { week: "Week 5", "8-A": 65, "8-B": 66, "9-A": 88, "10-A": 88, "10-B": 84 },
  { week: "Week 6", "8-A": 62, "8-B": 64, "9-A": 89, "10-A": 89, "10-B": 85 },
  { week: "Week 7", "8-A": 60, "8-B": 62, "9-A": 90, "10-A": 90, "10-B": 86 },
  { week: "Week 8", "8-A": 58, "8-B": 61, "9-A": 91, "10-A": 91, "10-B": 87 },
];

export const attendanceTrends = [
  { week: "Week 1", attendance: 92 },
  { week: "Week 2", attendance: 91 },
  { week: "Week 3", attendance: 88 },
  { week: "Week 4", attendance: 85 },
  { week: "Week 5", attendance: 86 },
  { week: "Week 6", attendance: 87 },
  { week: "Week 7", attendance: 88 },
  { week: "Week 8", attendance: 89 },
];

// Teacher activity log - expanded
export const teacherActivity = [
  {
    id: 1,
    teacher: "Dr. Rajesh Kumar",
    subject: "Mathematics",
    action: "Marked attendance for Class 8-A",
    time: "10:30 AM",
    class: "8-A",
    timestamp: new Date(Date.now() - 30 * 60000),
  },
  {
    id: 2,
    teacher: "Mrs. Priya Saxena",
    subject: "Science",
    action: "Entered marks for Mid-term exam",
    time: "09:45 AM",
    class: "8-B",
    timestamp: new Date(Date.now() - 75 * 60000),
  },
  {
    id: 3,
    teacher: "Mr. Vikram Joshi",
    subject: "English",
    action: "Created new assignment",
    time: "09:15 AM",
    class: "9-A",
    timestamp: new Date(Date.now() - 105 * 60000),
  },
  {
    id: 4,
    teacher: "Mrs. Sneha Gupta",
    subject: "Class Incharge",
    action: "Submitted attendance report",
    time: "08:30 AM",
    class: "8-A",
    timestamp: new Date(Date.now() - 190 * 60000),
  },
  {
    id: 5,
    teacher: "Mr. Ashok Sharma",
    subject: "Social Science",
    action: "Updated class syllabus",
    time: "Yesterday 3:30 PM",
    class: "8-A, 8-B",
    timestamp: new Date(Date.now() - 20.5 * 60 * 60000),
  },
];
