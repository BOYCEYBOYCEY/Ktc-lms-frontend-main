import { students } from "./students";
import { getSiblingDiscountForStudent } from "./parents";

// Base fees by class (CBSE school realistic amounts in INR)
export const baseFeesByClass = {
  "6-A": 42000, "6-B": 42000,
  "7-A": 44000, "7-B": 44000,
  "8-A": 46000, "8-B": 46000,
  "9-A": 48000, "9-B": 48000,
  "10-A": 50000, "10-B": 50000,
};

// Optional add-ons (annual amounts)
export const feeAddOns = {
  bus: { name: "Bus Transport", amount: 12000, icon: "🚌" },
  sports: { name: "Sports & Activities", amount: 8000, icon: "⚽" },
  music: { name: "Music Classes", amount: 6000, icon: "🎵" },
  coding: { name: "Coding Club", amount: 10000, icon: "💻" },
};

// Payment plan discount rates
export const paymentPlans = {
  annual: { label: "Annual", discount: 0.10, terms: 1 },
  halfYearly: { label: "Half-Yearly", discount: 0.05, terms: 2 },
  quarterly: { label: "Quarterly", discount: 0, terms: 4 },
};

// Late fee calculation
export const LATE_FEE_PER_DAY = 50;
export const LATE_FEE_MAX_DAYS = 30;

// Generate student fees for all students
const generateStudentFees = () => {
  const fees = {};

  students.forEach(student => {
    const baseFee = baseFeesByClass[student.class];

    // Randomly assign add-ons (20% bus, 30% sports, 15% music, 10% coding)
    const addOns = [];
    if (Math.random() < 0.20) addOns.push("bus");
    if (Math.random() < 0.30) addOns.push("sports");
    if (Math.random() < 0.15) addOns.push("music");
    if (Math.random() < 0.10) addOns.push("coding");

    const addOnsAmount = addOns.reduce((sum, addon) => sum + feeAddOns[addon].amount, 0);
    const totalAnnualFee = baseFee + addOnsAmount;

    // Randomly select payment plan
    const planRand = Math.random();
    let paymentPlan = "quarterly";
    if (planRand < 0.20) paymentPlan = "annual";
    else if (planRand < 0.50) paymentPlan = "halfYearly";

    const planInfo = paymentPlans[paymentPlan];
    const discountedTotal = totalAnnualFee * (1 - planInfo.discount);
    const amountPerTerm = discountedTotal / planInfo.terms;

    // Randomly determine payment status (60% paid, 25% pending, 15% overdue)
    const statusRand = Math.random();
    let status = "paid";
    let termsPaid = planInfo.terms;
    let paidAmount = discountedTotal;
    let pendingAmount = 0;
    let lateFee = 0;
    let dueDate = "2026-11-30";

    if (statusRand < 0.15) {
      // Overdue - paid less than due
      status = "overdue";
      termsPaid = Math.floor(Math.random() * planInfo.terms);
      paidAmount = amountPerTerm * termsPaid;
      pendingAmount = discountedTotal - paidAmount;
      const daysPastDue = Math.floor(Math.random() * 25) + 5;
      lateFee = Math.min(daysPastDue * LATE_FEE_PER_DAY, LATE_FEE_PER_DAY * LATE_FEE_MAX_DAYS);
      dueDate = new Date(Date.now() - daysPastDue * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    } else if (statusRand < 0.40) {
      // Pending - paid some, more due
      status = "pending";
      termsPaid = Math.floor(Math.random() * planInfo.terms);
      paidAmount = amountPerTerm * termsPaid;
      pendingAmount = discountedTotal - paidAmount;
      dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    }

    const siblingDiscount = getSiblingDiscountForStudent(student.id);

    fees[student.id] = {
      studentId: student.id,
      baseFee,
      addOns,
      totalAnnualFee,
      paymentPlan,
      discountPercentage: planInfo.discount * 100,
      discountAmount: totalAnnualFee * planInfo.discount,
      discountedTotal,
      amountPerTerm,
      termsPaid,
      paidAmount,
      pendingAmount,
      dueDate,
      status,
      lateFee,
      siblingDiscount,
      scholarshipDiscount: 0,
    };
  });

  return fees;
};

export const studentFees = generateStudentFees();

// Get all unique parent phones who have pending/overdue fees
export const getParentsWithPendingFees = () => {
  const parents = {};
  Object.values(studentFees).forEach(fee => {
    if (fee.status !== "paid") {
      const student = students.find(s => s.id === fee.studentId);
      parents[student.parentPhone] = true;
    }
  });
  return Object.keys(parents);
};
