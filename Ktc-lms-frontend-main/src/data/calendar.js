// Academic calendar data
export const academicEvents = [
  // Holidays
  { id: 1, title: 'Republic Day', date: '2027-01-26', type: 'holiday', description: 'National Holiday' },
  { id: 2, title: 'Holi', date: '2027-03-14', type: 'holiday', description: 'Festival Holiday' },
  { id: 3, title: 'Independence Day', date: '2027-08-15', type: 'holiday', description: 'National Holiday' },
  { id: 4, title: 'Diwali Break', date: '2026-11-12', type: 'holiday', description: 'Festival Holiday (3 days)' },
  { id: 5, title: 'Christmas', date: '2026-12-25', type: 'holiday', description: 'Christmas Holiday' },

  // Exams
  { id: 6, title: 'Term 1 Exam - Start', date: '2026-12-15', type: 'exam', description: 'Term 1 Final Examinations Begin' },
  { id: 7, title: 'Term 1 Exam - End', date: '2026-12-22', type: 'exam', description: 'Term 1 Final Examinations End' },
  { id: 8, title: 'Mid-Term Exam', date: '2026-09-15', type: 'exam', description: 'Mid-term Assessments' },
  { id: 9, title: 'Pre-Board Exam', date: '2027-01-10', type: 'exam', description: 'Practice Examination for Class 10' },

  // Events
  { id: 10, title: 'Annual Sports Day', date: '2026-11-20', type: 'event', description: 'School Annual Sports Competition' },
  { id: 11, title: 'Science Exhibition', date: '2026-12-05', type: 'event', description: 'Inter-class Science Project Exhibition' },
  { id: 12, title: 'Cultural Fest', date: '2027-02-14', type: 'event', description: 'Annual Day Celebration' },
  { id: 13, title: 'Parent-Teacher Meeting', date: '2026-11-25', type: 'ptm', description: 'Quarterly PTM for all classes' },
  { id: 14, title: 'PTM - Term 1 Results', date: '2027-01-05', type: 'ptm', description: 'Discuss Term 1 Performance' },

  // Important Dates
  { id: 15, title: 'Fee Payment Deadline', date: '2026-11-30', type: 'deadline', description: 'Last date for fee payment without late fee' },
  { id: 16, title: 'Admission Process Begins', date: '2027-03-01', type: 'admin', description: 'New session 2027-28 admissions open' },
];

// Get events for a specific month
export const getEventsForMonth = (year, month) => {
  return academicEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};

// Get upcoming events
export const getUpcomingEvents = (limit = 5) => {
  const today = new Date();
  return academicEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);
};

// Get events by type
export const getEventsByType = (type) => {
  return academicEvents.filter(event => event.type === type);
};

// Event type colors
export const eventTypeColors = {
  holiday: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  exam: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  event: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  ptm: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  deadline: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  admin: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
};
