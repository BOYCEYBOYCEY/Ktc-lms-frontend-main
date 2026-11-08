import { students } from "./students";

// Fee waivers and scholarships (merit, hardship, sibling)
export const feeWaivers = [
  {
    id: 1,
    studentId: 1,
    studentName: "Student 1",
    class: "8-A",
    type: "merit",
    discountPercent: 25,
    reason: "95% average in previous term - Merit Scholar",
    status: "approved",
    appliedDate: "2026-03-15",
    approvedBy: "Principal",
    validUntil: "2027-03-31",
  },
  {
    id: 2,
    studentId: 5,
    studentName: "Student 5",
    class: "8-B",
    type: "hardship",
    discountPercent: 50,
    reason: "Single parent, financial hardship - eligible for EWS",
    status: "pending",
    appliedDate: "2026-11-01",
  },
  {
    id: 3,
    studentId: 15,
    studentName: "Student 15",
    class: "8-A",
    type: "merit",
    discountPercent: 15,
    reason: "Consistent 90%+ performance across subjects",
    status: "approved",
    appliedDate: "2026-02-20",
    approvedBy: "Principal",
    validUntil: "2027-02-28",
  },
  {
    id: 4,
    studentId: 25,
    studentName: "Student 25",
    class: "9-A",
    type: "hardship",
    discountPercent: 35,
    reason: "Parent in healthcare, single income family",
    status: "pending",
    appliedDate: "2026-10-15",
  },
  {
    id: 5,
    studentId: 45,
    studentName: "Student 45",
    class: "9-B",
    type: "merit",
    discountPercent: 20,
    reason: "Science Olympiad winner 2026",
    status: "approved",
    appliedDate: "2026-04-10",
    approvedBy: "Principal",
    validUntil: "2027-04-09",
  },
  {
    id: 6,
    studentId: 60,
    studentName: "Student 60",
    class: "10-A",
    type: "hardship",
    discountPercent: 40,
    reason: "Flood victim family - emergency support",
    status: "pending",
    appliedDate: "2026-10-20",
  },
  {
    id: 7,
    studentId: 80,
    studentName: "Student 80",
    class: "10-B",
    type: "merit",
    discountPercent: 30,
    reason: "All-rounder - academic excellence + sports",
    status: "approved",
    appliedDate: "2026-05-01",
    approvedBy: "Principal",
    validUntil: "2027-04-30",
  },
  {
    id: 8,
    studentId: 100,
    studentName: "Student 100",
    class: "6-A",
    type: "hardship",
    discountPercent: 25,
    reason: "Single parent income below poverty line",
    status: "pending",
    appliedDate: "2026-11-05",
  },
  {
    id: 9,
    studentId: 150,
    studentName: "Student 150",
    class: "7-A",
    type: "sibling",
    discountPercent: 10,
    reason: "Additional sibling discount",
    status: "approved",
    appliedDate: "2026-01-15",
    approvedBy: "Principal",
    validUntil: "2027-12-31",
  },
  {
    id: 10,
    studentId: 200,
    studentName: "Student 200",
    class: "9-A",
    type: "hardship",
    discountPercent: 50,
    reason: "Job loss due to economic downturn - parent unemployed",
    status: "approved",
    appliedDate: "2026-06-01",
    approvedBy: "Principal",
    validUntil: "2027-05-31",
  },
];

// Filter pending waivers for principal approval
export const pendingWaiverRequests = feeWaivers.filter(w => w.status === "pending");

// Get waiver for a student
export const getStudentWaivers = (studentId) => {
  return feeWaivers.filter(w => w.studentId === studentId);
};

// Get approved waivers for a student
export const getApprovedWaiversForStudent = (studentId) => {
  return feeWaivers.filter(w => w.studentId === studentId && w.status === "approved");
};

// Calculate total discount percentage for a student (sum of all approved waivers)
export const calculateTotalDiscountForStudent = (studentId) => {
  const approvedWaivers = getApprovedWaiversForStudent(studentId);
  return approvedWaivers.reduce((sum, w) => sum + w.discountPercent, 0);
};
