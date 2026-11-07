// Attendance percentage for each student (current month)
export const attendance = {
  1: 94, // Ravi Kumar
  2: 98, // Priya Sharma
  3: 72, // Arjun Singh ⚠️ AT-RISK (low attendance)
  4: 96, // Neha Patel
  5: 68, // Akshay Gupta ⚠️ AT-RISK (very low)
  6: 92, // Zara Khan
  7: 100, // Kavya Menon
  8: 95, // Rohan Desai
  9: 65, // Isha Verma ⚠️ AT-RISK (very low)
  10: 97, // Aditya Malhotra
  11: 93, // Divya Nair
  12: 58, // Samir Joshi ⚠️ AT-RISK (critical)
  13: 91, // Esha Das
  14: 96, // Harsh Reddy
  15: 99, // Meera Pillai
};

// Detailed attendance records (last 30 days) - just a few entries as example
export const attendanceDetails = {
  3: [
    // Arjun Singh - AT-RISK
    { date: "2026-11-01", status: "present" },
    { date: "2026-11-02", status: "present" },
    { date: "2026-11-03", status: "absent" },
    { date: "2026-11-04", status: "absent" },
    { date: "2026-11-05", status: "present" },
    { date: "2026-11-06", status: "absent" },
    { date: "2026-11-07", status: "present" },
  ],
  9: [
    // Isha Verma - AT-RISK
    { date: "2026-11-01", status: "absent" },
    { date: "2026-11-02", status: "absent" },
    { date: "2026-11-03", status: "present" },
    { date: "2026-11-04", status: "absent" },
    { date: "2026-11-05", status: "absent" },
    { date: "2026-11-06", status: "present" },
    { date: "2026-11-07", status: "absent" },
  ],
  12: [
    // Samir Joshi - AT-RISK
    { date: "2026-11-01", status: "absent" },
    { date: "2026-11-02", status: "absent" },
    { date: "2026-11-03", status: "absent" },
    { date: "2026-11-04", status: "present" },
    { date: "2026-11-05", status: "absent" },
    { date: "2026-11-06", status: "absent" },
    { date: "2026-11-07", status: "absent" },
  ],
};
