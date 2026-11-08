// Upcoming one-time fees (exams, events, trips, etc.)
export const upcomingFees = [
  {
    id: 1,
    type: "exam",
    title: "Half-Yearly Exam Fee",
    amount: 3000,
    dueDate: "2026-12-01",
    description: "Exam papers, invigilation, result processing",
    applicableClasses: ["8-A", "8-B", "9-A", "9-B", "10-A", "10-B"],
    icon: "📝",
  },
  {
    id: 2,
    type: "event",
    title: "Annual Day Participation",
    amount: 2500,
    dueDate: "2027-01-15",
    description: "Costume, props, refreshments for annual day function",
    applicableClasses: ["6-A", "6-B", "7-A", "7-B"],
    icon: "🎭",
  },
  {
    id: 3,
    type: "excursion",
    title: "Science Museum Educational Trip",
    amount: 1500,
    dueDate: "2026-12-20",
    description: "Transport, entry tickets, lunch, activity materials",
    applicableClasses: ["9-A", "9-B"],
    icon: "🚌",
  },
  {
    id: 4,
    type: "camp",
    title: "Summer Science Camp",
    amount: 2000,
    dueDate: "2027-04-01",
    description: "5-day residential science camp with hands-on experiments",
    applicableClasses: ["8-A", "8-B", "9-A", "9-B", "10-A", "10-B"],
    icon: "⛺",
  },
  {
    id: 5,
    type: "sports",
    title: "Inter-School Sports Tournament",
    amount: 1200,
    dueDate: "2027-02-15",
    description: "Registration and participation fee for athletics",
    applicableClasses: ["9-A", "9-B", "10-A", "10-B"],
    icon: "🏅",
  },
  {
    id: 6,
    type: "event",
    title: "Republic Day Celebration & Prize Distribution",
    amount: 800,
    dueDate: "2027-01-20",
    description: "Refreshments, prizes, decoration materials",
    applicableClasses: ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B"],
    icon: "🎊",
  },
  {
    id: 7,
    type: "exam",
    title: "Annual Exam Fee",
    amount: 3500,
    dueDate: "2027-03-01",
    description: "Annual board exam papers, invigilators, evaluation",
    applicableClasses: ["10-A", "10-B"],
    icon: "📊",
  },
];

// Get applicable upcoming fees for a student based on class
export const getUpcomingFeesForStudent = (studentClass) => {
  return upcomingFees.filter(f => f.applicableClasses.includes(studentClass));
};

// Get upcoming fees due in next 30 days
export const getUpcomingFeesDuesoon = () => {
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return upcomingFees.filter(f => {
    const dueDate = new Date(f.dueDate);
    return dueDate >= today && dueDate <= thirtyDaysLater;
  });
};

// Get overdue upcoming fees
export const getOverdueUpcomingFees = () => {
  const today = new Date();
  return upcomingFees.filter(f => new Date(f.dueDate) < today);
};
