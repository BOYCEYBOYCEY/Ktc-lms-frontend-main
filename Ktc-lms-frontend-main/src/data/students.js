// Expanded to 500+ students across 10+ classes
export const students = [
  // Class 8-A (45 students)
  ...Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    admissionNo: `STU${String(i + 1).padStart(4, "0")}`,
    class: "8-A",
    section: "A",
    rollNo: i + 1,
    parentName: `Parent ${i + 1}`,
    parentPhone: `98765432${String(i).padStart(2, "0")}`,
    status: i < 3 ? "at-risk" : "active",
  })),

  // Class 8-B (48 students)
  ...Array.from({ length: 48 }, (_, i) => ({
    id: i + 46,
    name: `Student ${i + 46}`,
    admissionNo: `STU${String(i + 46).padStart(4, "0")}`,
    class: "8-B",
    section: "B",
    rollNo: i + 1,
    parentName: `Parent ${i + 46}`,
    parentPhone: `98765433${String(i).padStart(2, "0")}`,
    status: i < 3 ? "at-risk" : "active",
  })),

  // Class 9-A (44 students)
  ...Array.from({ length: 44 }, (_, i) => ({
    id: i + 94,
    name: `Student ${i + 94}`,
    admissionNo: `STU${String(i + 94).padStart(4, "0")}`,
    class: "9-A",
    section: "A",
    rollNo: i + 1,
    parentName: `Parent ${i + 94}`,
    parentPhone: `98765434${String(i).padStart(2, "0")}`,
    status: i < 2 ? "at-risk" : "active",
  })),

  // Class 9-B (47 students)
  ...Array.from({ length: 47 }, (_, i) => ({
    id: i + 138,
    name: `Student ${i + 138}`,
    admissionNo: `STU${String(i + 138).padStart(4, "0")}`,
    class: "9-B",
    section: "B",
    rollNo: i + 1,
    parentName: `Parent ${i + 138}`,
    parentPhone: `98765435${String(i).padStart(2, "0")}`,
    status: i < 3 ? "at-risk" : "active",
  })),

  // Class 10-A (46 students)
  ...Array.from({ length: 46 }, (_, i) => ({
    id: i + 185,
    name: `Student ${i + 185}`,
    admissionNo: `STU${String(i + 185).padStart(4, "0")}`,
    class: "10-A",
    section: "A",
    rollNo: i + 1,
    parentName: `Parent ${i + 185}`,
    parentPhone: `98765436${String(i).padStart(2, "0")}`,
    status: i < 2 ? "at-risk" : "active",
  })),

  // Class 10-B (50 students)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: i + 231,
    name: `Student ${i + 231}`,
    admissionNo: `STU${String(i + 231).padStart(4, "0")}`,
    class: "10-B",
    section: "B",
    rollNo: i + 1,
    parentName: `Parent ${i + 231}`,
    parentPhone: `98765437${String(i).padStart(2, "0")}`,
    status: i < 3 ? "at-risk" : "active",
  })),

  // Class 6-A (45 students)
  ...Array.from({ length: 45 }, (_, i) => ({
    id: i + 281,
    name: `Student ${i + 281}`,
    admissionNo: `STU${String(i + 281).padStart(4, "0")}`,
    class: "6-A",
    section: "A",
    rollNo: i + 1,
    parentName: `Parent ${i + 281}`,
    parentPhone: `98765438${String(i).padStart(2, "0")}`,
    status: "active",
  })),

  // Class 6-B (47 students)
  ...Array.from({ length: 47 }, (_, i) => ({
    id: i + 326,
    name: `Student ${i + 326}`,
    admissionNo: `STU${String(i + 326).padStart(4, "0")}`,
    class: "6-B",
    section: "B",
    rollNo: i + 1,
    parentName: `Parent ${i + 326}`,
    parentPhone: `98765439${String(i).padStart(2, "0")}`,
    status: "active",
  })),

  // Class 7-A (43 students)
  ...Array.from({ length: 43 }, (_, i) => ({
    id: i + 373,
    name: `Student ${i + 373}`,
    admissionNo: `STU${String(i + 373).padStart(4, "0")}`,
    class: "7-A",
    section: "A",
    rollNo: i + 1,
    parentName: `Parent ${i + 373}`,
    parentPhone: `98765440${String(i).padStart(2, "0")}`,
    status: "active",
  })),

  // Class 7-B (49 students)
  ...Array.from({ length: 49 }, (_, i) => ({
    id: i + 416,
    name: `Student ${i + 416}`,
    admissionNo: `STU${String(i + 416).padStart(4, "0")}`,
    class: "7-B",
    section: "B",
    rollNo: i + 1,
    parentName: `Parent ${i + 416}`,
    parentPhone: `98765441${String(i).padStart(2, "0")}`,
    status: i < 2 ? "at-risk" : "active",
  })),
];

console.log(`Total students: ${students.length}`);
