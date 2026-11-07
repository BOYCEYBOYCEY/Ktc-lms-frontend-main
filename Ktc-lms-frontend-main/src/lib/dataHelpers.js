import { students } from "../data/students";
import { marks } from "../data/marks";
import { attendance } from "../data/attendance";

// Get all students data
export const getStudents = () => students;

// Get at-risk students with reasons (HERO FEATURE)
export const getAtRiskStudents = () => {
  return students
    .filter((student) => student.status === "at-risk")
    .map((student) => {
      const studentMarks = marks[student.id];
      const studentAttendance = attendance[student.id];

      const reasons = [];
      const avgCurrentMarks =
        Object.values(studentMarks.currentMarks).reduce((a, b) => a + b) / 5;
      const avgPreviousMarks =
        Object.values(studentMarks.previousMarks).reduce((a, b) => a + b) / 5;
      const marksDrop = avgPreviousMarks - avgCurrentMarks;

      if (marksDrop > 15) {
        reasons.push(
          `Marks dropped by ${Math.round(marksDrop)}% (${Math.round(avgPreviousMarks)} → ${Math.round(avgCurrentMarks)})`
        );
      }

      if (studentAttendance < 75) {
        reasons.push(
          `Low attendance: ${studentAttendance}% (absent ${Math.round(30 - (studentAttendance * 30) / 100)} days)`
        );
      }

      if (avgCurrentMarks < 50) {
        reasons.push(`Scoring below 50% in all subjects (avg: ${Math.round(avgCurrentMarks)}%)`);
      }

      return {
        ...student,
        currentAvgMarks: Math.round(avgCurrentMarks),
        attendance: studentAttendance,
        reasons,
        severity:
          marksDrop > 20 || studentAttendance < 60 ? "critical" : "warning",
      };
    })
    .sort((a, b) => {
      // Sort by severity, then by marks drop
      const severityOrder = { critical: 0, warning: 1 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
};

// Get student detail including marks trend
export const getStudentDetail = (studentId) => {
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const studentMarks = marks[studentId];
  const studentAttendance = attendance[studentId];

  const avgCurrentMarks =
    Object.values(studentMarks.currentMarks).reduce((a, b) => a + b) / 5;
  const avgPreviousMarks =
    Object.values(studentMarks.previousMarks).reduce((a, b) => a + b) / 5;

  return {
    ...student,
    marks: studentMarks,
    attendance: studentAttendance,
    avgCurrentMarks: Math.round(avgCurrentMarks),
    avgPreviousMarks: Math.round(avgPreviousMarks),
  };
};

// Calculate class-wise statistics
export const getClassStats = (className) => {
  const classStudents = students.filter((s) => s.class === className);
  const classMarks = classStudents.map((s) => marks[s.id]);

  const avgMarks =
    classMarks.reduce(
      (sum, m) =>
        sum +
        Object.values(m.currentMarks).reduce((a, b) => a + b) /
          Object.values(m.currentMarks).length,
      0
    ) / classStudents.length;

  const avgAttendance =
    classStudents.reduce((sum, s) => sum + attendance[s.id], 0) /
    classStudents.length;

  const atRiskCount = classStudents.filter((s) => s.status === "at-risk").length;

  return {
    className,
    totalStudents: classStudents.length,
    avgMarks: Math.round(avgMarks),
    avgAttendance: Math.round(avgAttendance),
    atRiskCount,
  };
};

// Get school-wide statistics
export const getSchoolStats = () => {
  const allAtRisk = getAtRiskStudents();
  const classStats = ["8-A", "8-B", "9-A"].map((c) => getClassStats(c));

  const totalStudents = students.length;
  const avgSchoolMarks = Math.round(
    students.reduce((sum, s) => {
      const m = marks[s.id];
      const avg = Object.values(m.currentMarks).reduce((a, b) => a + b) / 5;
      return sum + avg;
    }, 0) / totalStudents
  );

  const avgSchoolAttendance = Math.round(
    students.reduce((sum, s) => sum + attendance[s.id], 0) / totalStudents
  );

  return {
    totalStudents,
    totalTeachers: 8,
    totalClasses: 3,
    avgMarks: avgSchoolMarks,
    avgAttendance: avgSchoolAttendance,
    atRiskStudents: allAtRisk.length,
    classStats,
  };
};
