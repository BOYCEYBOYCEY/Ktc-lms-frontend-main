// Parent-to-child mapping (siblings grouped by parent phone)
// 70% have 1 child, 25% have 2 children, 5% have 3 children
export const parentChildMap = {
  "9876543200": [1, 2],
  "9876543201": [3],
  "9876543202": [4, 5, 6],
  "9876543203": [7],
  "9876543204": [8, 9],
  "9876543205": [10],
  "9876543206": [11, 12, 13],
  "9876543207": [14],
  "9876543208": [15, 16],
  "9876543209": [17],
  "9876543210": [18, 19],
  "9876543211": [20],
  "9876543212": [21, 22, 23],
  "9876543213": [24],
  "9876543214": [25, 26],
  "9876543215": [27],
  "9876543216": [28, 29],
  "9876543217": [30],
  "9876543218": [31, 32, 33],
  "9876543219": [34],
  "9876543220": [35, 36],
  "9876543221": [37],
  "9876543222": [38, 39],
  "9876543223": [40],
  "9876543224": [41, 42, 43],
  "9876543225": [44],
  "9876543226": [45, 46],
  "9876543227": [47],
  "9876543228": [48, 49],
  "9876543229": [50],
};

// Generate programmatically for remaining students (up to 465)
const generateParentMap = () => {
  const map = { ...parentChildMap };
  const usedStudents = new Set(Object.values(parentChildMap).flat());
  let parentIndex = 230;

  for (let studentId = 51; studentId <= 465; studentId++) {
    if (usedStudents.has(studentId)) continue;

    const rand = Math.random();
    let childrenCount = 1;

    if (rand < 0.25) childrenCount = 2;
    else if (rand < 0.30) childrenCount = 3;

    const parentPhone = `987654${String(parentIndex).padStart(4, "0")}`;
    map[parentPhone] = [studentId];

    for (let i = 1; i < childrenCount; i++) {
      let nextStudentId = studentId + 1;
      while (usedStudents.has(nextStudentId) && nextStudentId <= 465) {
        nextStudentId++;
      }
      if (nextStudentId <= 465) {
        map[parentPhone].push(nextStudentId);
        usedStudents.add(nextStudentId);
      }
      studentId = nextStudentId;
    }

    parentIndex++;
    usedStudents.add(studentId);
  }

  return map;
};

export const allParentChildMap = generateParentMap();

// Reverse lookup: studentId -> parentPhone
export const studentToParent = {};
Object.entries(allParentChildMap).forEach(([parentPhone, children]) => {
  children.forEach(childId => {
    studentToParent[childId] = parentPhone;
  });
});

// Sibling discount rules (% discount for nth child)
export const siblingDiscountRules = {
  1: 0,      // 1st child: no discount
  2: 0.10,   // 2nd child: 10% off
  3: 0.15,   // 3rd+ child: 15% off
};

// Get discount for a student based on sibling position
export const getSiblingDiscountForStudent = (studentId) => {
  const parentPhone = studentToParent[studentId];
  if (!parentPhone) return 0;

  const siblings = allParentChildMap[parentPhone] || [];
  if (siblings.length < 2) return 0;

  const position = siblings.indexOf(studentId);
  return siblingDiscountRules[Math.min(position + 1, 3)] || 0;
};
