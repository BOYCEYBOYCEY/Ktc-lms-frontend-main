import { students } from "../data/students";
import { marks } from "../data/marks";
import { attendance } from "../data/attendance";
import { allParentChildMap, studentToParent, getSiblingDiscountForStudent } from "../data/parents";
import { studentFees, LATE_FEE_PER_DAY, LATE_FEE_MAX_DAYS } from "../data/fees";
import { paymentHistory } from "../data/paymentHistory";
import { feeWaivers, getApprovedWaiversForStudent, calculateTotalDiscountForStudent } from "../data/feeWaivers";
import { upcomingFees, getUpcomingFeesForStudent } from "../data/upcomingFees";

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

// ============ FEE MANAGEMENT HELPERS ============

// Get parent's children list
export const getParentChildren = (parentPhone) => {
  const childIds = allParentChildMap[parentPhone] || [];
  return childIds
    .map(id => {
      const student = students.find(s => s.id === id);
      return student ? { ...student, fees: studentFees[id] } : null;
    })
    .filter(Boolean);
};

// Get student fees with all details
export const getStudentFeeDetails = (studentId) => {
  const feeRecord = studentFees[studentId];
  const student = students.find(s => s.id === studentId);
  const approvedWaivers = getApprovedWaiversForStudent(studentId);
  const history = paymentHistory[studentId] || [];
  const siblingDiscount = getSiblingDiscountForStudent(studentId);

  const totalWaiverDiscount = calculateTotalDiscountForStudent(studentId);
  const finalDiscount = Math.max(siblingDiscount, totalWaiverDiscount / 100);

  return {
    ...feeRecord,
    student,
    approvedWaivers,
    history,
    siblingDiscount,
    totalWaiverDiscount,
    finalDiscount,
    finalAmount: feeRecord.discountedTotal * (1 - finalDiscount),
  };
};

// Get upcoming fees for a student
export const getStudentUpcomingFees = (studentId) => {
  const student = students.find(s => s.id === studentId);
  return getUpcomingFeesForStudent(student.class);
};

// Principal: School-wide fee summary
export const getSchoolFeeSummary = () => {
  const allFees = Object.values(studentFees);

  const totalExpected = allFees.reduce((sum, f) => sum + f.discountedTotal, 0);
  const totalCollected = allFees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = allFees.reduce((sum, f) => sum + f.pendingAmount, 0);

  const overdueFees = allFees.filter(f => f.status === "overdue");
  const collectionRate = (totalCollected / totalExpected) * 100;

  return {
    totalExpected,
    totalCollected,
    totalPending,
    totalLateFees: overdueFees.reduce((sum, f) => sum + f.lateFee, 0),
    collectionRate: Math.round(collectionRate),
    overdueCount: overdueFees.length,
    overdueAmount: overdueFees.reduce((sum, f) => sum + (f.pendingAmount + f.lateFee), 0),
    pendingCount: allFees.filter(f => f.status === "pending").length,
  };
};

// Principal: Pending fees by class
export const getPendingFeesByClass = () => {
  const byClass = {};
  Object.values(studentFees).forEach(f => {
    const student = students.find(s => s.id === f.studentId);
    if (!byClass[student.class]) {
      byClass[student.class] = { pending: 0, count: 0, total: 0 };
    }
    byClass[student.class].total += f.discountedTotal;
    byClass[student.class].pending += f.pendingAmount + f.lateFee;
    if (f.status !== "paid") byClass[student.class].count++;
  });

  return Object.entries(byClass)
    .map(([className, data]) => ({
      className,
      ...data,
      collectionPercent: Math.round(((data.total - data.pending) / data.total) * 100),
    }))
    .sort((a, b) => b.pending - a.pending);
};

// Principal: Top overdue families
export const getTopOverdueFamilies = (limit = 5) => {
  const familyDebt = {};

  Object.values(studentFees).forEach(f => {
    if (f.status === "overdue" || (f.status === "pending" && f.pendingAmount > 0)) {
      const student = students.find(s => s.id === f.studentId);
      const parentPhone = student.parentPhone;

      if (!familyDebt[parentPhone]) {
        familyDebt[parentPhone] = {
          parentName: student.parentName,
          parentPhone,
          totalDue: 0,
          students: [],
          daysPastDue: 0,
        };
      }
      familyDebt[parentPhone].totalDue += f.pendingAmount + f.lateFee;
      if (!familyDebt[parentPhone].students.includes(student.name)) {
        familyDebt[parentPhone].students.push(student.name);
      }
      if (f.status === "overdue") {
        const daysPast = Math.floor((new Date() - new Date(f.dueDate)) / (1000 * 60 * 60 * 24));
        familyDebt[parentPhone].daysPastDue = Math.max(familyDebt[parentPhone].daysPastDue, daysPast);
      }
    }
  });

  return Object.values(familyDebt)
    .filter(f => f.totalDue > 0)
    .sort((a, b) => b.totalDue - a.totalDue)
    .slice(0, limit);
};

// Get pending waiver requests (for principal dashboard)
export const getPendingWaiverRequests = () => {
  return feeWaivers.filter(w => w.status === "pending");
};

// Calculate late fees for overdue amount
export const calculateLateFee = (pendingAmount, daysPastDue) => {
  const daysToCharge = Math.min(daysPastDue, LATE_FEE_MAX_DAYS);
  return daysToCharge * LATE_FEE_PER_DAY;
};
