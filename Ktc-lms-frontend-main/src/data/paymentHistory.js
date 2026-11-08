import { studentFees } from "./fees";

// Generate payment history for students who have paid at least once
const generatePaymentHistory = () => {
  const history = {};

  Object.entries(studentFees).forEach(([studentId, feeRecord]) => {
    if (feeRecord.termsPaid > 0) {
      const payments = [];

      // Generate payment records for each term paid
      for (let i = 0; i < feeRecord.termsPaid; i++) {
        const monthsBack = (feeRecord.termsPaid - i) * 3;
        const paymentDate = new Date(Date.now() - monthsBack * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const methods = ["UPI", "Net Banking", "Card"];
        const method = methods[Math.floor(Math.random() * methods.length)];

        let transactionId = "";
        if (method === "UPI") {
          transactionId = `UPI${paymentDate.replace(/-/g, "")}${Math.random().toString().slice(2, 10)}`;
        } else if (method === "Net Banking") {
          transactionId = `NB${paymentDate.replace(/-/g, "")}${Math.random().toString().slice(2, 8)}`;
        } else {
          transactionId = `CC${paymentDate.replace(/-/g, "")}${Math.random().toString().slice(2, 8)}`;
        }

        payments.push({
          id: `PAY${String(parseInt(studentId) * 100 + i + 1).padStart(5, "0")}`,
          studentId: parseInt(studentId),
          amount: feeRecord.amountPerTerm,
          paymentDate,
          term: `Q${i + 1} 2026-27`,
          method,
          transactionId,
          status: "success",
          receiptId: `RCP${String(parseInt(studentId) * 100 + i + 1).padStart(5, "0")}`,
        });
      }

      history[studentId] = payments;
    }
  });

  return history;
};

export const paymentHistory = generatePaymentHistory();

// Get payment history for a student
export const getStudentPaymentHistory = (studentId) => {
  return paymentHistory[studentId] || [];
};

// Get total paid amount for a student (sum of all payments)
export const getTotalPaidForStudent = (studentId) => {
  const payments = paymentHistory[studentId] || [];
  return payments.reduce((sum, p) => sum + p.amount, 0);
};
