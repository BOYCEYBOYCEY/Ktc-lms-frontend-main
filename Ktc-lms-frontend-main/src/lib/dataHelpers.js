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

// ============ LEDGER SYSTEM (NEW) ============

// Generate comprehensive ledger for a student
export const getStudentLedger = (studentId) => {
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const feeRecord = studentFees[studentId];
  if (!feeRecord) return null;

  const history = paymentHistory[studentId] || [];
  const waivers = feeWaivers.filter(w => w.studentId === studentId);

  const ledgerEntries = [];
  let runningBalance = 0;

  // Opening balance (first charge date)
  const chargeDate = new Date();
  chargeDate.setMonth(5); // June = start of academic year
  chargeDate.setDate(1);

  // 1. Add initial fee charge
  const baseFee = Math.max(0, feeRecord.discountedTotal || 0);
  const addOnsArray = Array.isArray(feeRecord.addOns) ? feeRecord.addOns : [];

  ledgerEntries.push({
    id: `CHARGE-${studentId}-0`,
    date: chargeDate.toISOString().split('T')[0],
    type: 'fee_charge',
    description: `Annual Fee Charged (${addOnsArray.length > 0 ? 'with add-ons' : 'base only'})`,
    debit: baseFee,
    credit: 0,
    runningBalance: 0,
    details: {
      baseFee: Math.max(0, feeRecord.baseFee || 0),
      addOns: addOnsArray,
      discountPercentage: Math.max(0, feeRecord.discountPercentage || 0),
    },
  });
  runningBalance = baseFee;

  // 2. Add approved waivers/scholarships
  const approvedWaivers = waivers.filter(w => w.status === 'approved');
  approvedWaivers.forEach((waiver, idx) => {
    const waiverDate = new Date(waiver.approvalDate || chargeDate);
    const discountAmount = Math.max(0, (baseFee * (waiver.discountPercentage || waiver.requestedDiscount || 0)) / 100);

    ledgerEntries.push({
      id: `WAIVER-${studentId}-${idx}`,
      date: waiverDate.toISOString().split('T')[0],
      type: 'waiver',
      description: `${waiver.type} Approved (${waiver.reason})`,
      debit: 0,
      credit: discountAmount,
      runningBalance: 0,
      details: waiver,
    });
    runningBalance -= discountAmount;
  });

  // 3. Add payments (chronologically sorted)
  if (Array.isArray(history)) {
    history.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)).forEach(payment => {
      const paymentAmount = Math.max(0, payment.amount || 0);
      ledgerEntries.push({
        id: payment.id,
        date: payment.paymentDate,
        type: 'payment',
        description: `Payment Received - ${payment.method || 'Unknown'}`,
        debit: 0,
        credit: paymentAmount,
        runningBalance: 0,
        details: {
          transactionId: payment.transactionId || 'N/A',
          method: payment.method || 'N/A',
          term: payment.term || 'N/A',
        },
      });
      runningBalance -= paymentAmount;
    });
  }

  // 4. Add late fees (if overdue)
  const lateFeeAmount = Math.max(0, feeRecord.lateFee || 0);
  if (feeRecord.status === 'overdue' && lateFeeAmount > 0) {
    const lateFeeDate = new Date(feeRecord.dueDate);
    lateFeeDate.setDate(lateFeeDate.getDate() + 30);
    const daysPastDue = Math.max(0, Math.floor((Date.now() - new Date(feeRecord.dueDate).getTime()) / (1000 * 60 * 60 * 24)));

    ledgerEntries.push({
      id: `LATEFEE-${studentId}`,
      date: lateFeeDate.toISOString().split('T')[0],
      type: 'late_fee',
      description: `Late Fee Applied (₹${LATE_FEE_PER_DAY}/day for ${Math.min(daysPastDue, 30)} days)`,
      debit: lateFeeAmount,
      credit: 0,
      runningBalance: 0,
      details: {
        dailyRate: LATE_FEE_PER_DAY,
        daysPastDue,
      },
    });
    runningBalance += lateFeeAmount;
  }

  // Sort by date
  ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Recalculate running balances after sorting
  runningBalance = 0;
  ledgerEntries.forEach(entry => {
    runningBalance = runningBalance + entry.debit - entry.credit;
    entry.runningBalance = Math.max(0, runningBalance);
  });

  const totalWaived = approvedWaivers.reduce((sum, w) => sum + Math.max(0, (baseFee * (w.discountPercentage || w.requestedDiscount || 0)) / 100), 0);
  const totalPaid = Array.isArray(history) ? history.reduce((sum, p) => sum + Math.max(0, p.amount || 0), 0) : 0;

  return {
    student,
    feeRecord,
    ledgerEntries,
    summary: {
      totalCharged: baseFee,
      totalWaived,
      totalPaid,
      lateFees: lateFeeAmount,
      currentBalance: Math.max(0, runningBalance),
      paymentStatus: feeRecord.status || 'unknown',
    },
  };
};

// Get ledger for all families (admin view)
export const getAllFamilyLedgers = () => {
  const familyLedgers = {};

  Object.entries(studentFees).forEach(([studentIdStr, feeRecord]) => {
    const studentId = parseInt(studentIdStr);
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const parentPhone = student.parentPhone;
    if (!familyLedgers[parentPhone]) {
      familyLedgers[parentPhone] = {
        parentName: student.parentName,
        parentPhone,
        children: [],
        familyLedger: [],
        totalBalance: 0,
        paymentTrend: 'unknown',
      };
    }

    const ledger = getStudentLedger(studentId);
    if (ledger) {
      familyLedgers[parentPhone].children.push({
        id: student.id,
        name: student.name,
        class: student.class,
        balance: ledger.summary.currentBalance,
      });
      familyLedgers[parentPhone].totalBalance += ledger.summary.currentBalance;
      familyLedgers[parentPhone].familyLedger.push(...ledger.ledgerEntries);
    }
  });

  // Calculate payment trends
  Object.values(familyLedgers).forEach(family => {
    const payments = family.familyLedger.filter(e => e.type === 'payment');
    if (payments.length === 0) {
      family.paymentTrend = 'no_payment';
    } else {
      const recentPayments = payments.slice(-3);
      const avgDaysApart = recentPayments.length > 1
        ? Math.round((new Date(recentPayments[recentPayments.length - 1].date) - new Date(recentPayments[0].date)) / (1000 * 60 * 60 * 24) / (recentPayments.length - 1))
        : 0;
      family.paymentTrend = avgDaysApart > 120 ? 'late_payer' : 'regular_payer';
    }
  });

  return familyLedgers;
};

// Analyze payment behavior
export const getPaymentAnalytics = (studentId) => {
  const ledger = getStudentLedger(studentId);
  if (!ledger) return null;

  const payments = ledger.ledgerEntries.filter(e => e.type === 'payment');
  if (payments.length === 0) return { behavior: 'never_paid', onTimePayments: 0, latePayments: 0 };

  const onTimePayments = payments.filter(p => {
    const paymentDate = new Date(p.date);
    return paymentDate.getTime() <= new Date(ledger.feeRecord.dueDate).getTime();
  }).length;

  const latePayments = payments.length - onTimePayments;

  return {
    behavior: latePayments > payments.length / 2 ? 'late_payer' : 'on_time_payer',
    totalPayments: payments.length,
    onTimePayments,
    latePayments,
    averageDaysLate: latePayments > 0 ? Math.round(
      payments
        .filter(p => new Date(p.date) > new Date(ledger.feeRecord.dueDate))
        .reduce((sum, p) => sum + Math.floor((new Date(p.date) - new Date(ledger.feeRecord.dueDate)) / (1000 * 60 * 60 * 24)), 0) / latePayments
    ) : 0,
  };
};
