// Generate attendance for all students
const generateAttendance = (isAtRisk) => {
  if (isAtRisk) {
    return 50 + Math.random() * 25; // Low attendance
  }
  return 85 + Math.random() * 15; // Normal attendance
};

export const attendance = {};
for (let i = 1; i <= 465; i++) {
  const isAtRisk = i <= 45 ? i < 3 : i <= 94 ? i < 49 : i <= 138 ? i < 96 : i <= 185 ? i < 141 : i <= 231 ? i < 188 : i <= 281 ? i < 234 : i <= 326 ? false : i <= 373 ? false : i <= 416 ? i < 418 : false;
  attendance[i] = Math.round(generateAttendance(isAtRisk));
}
