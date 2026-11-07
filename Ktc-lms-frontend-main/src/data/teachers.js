const teacherNames = [
  "Dr. Rajesh Kumar", "Mrs. Priya Saxena", "Mr. Vikram Joshi", "Mrs. Anita Verma",
  "Mr. Ashok Sharma", "Mrs. Sneha Gupta", "Mr. Rajiv Nair", "Mrs. Deepa Menon",
  "Mr. Amit Patel", "Mrs. Kavya Singh", "Mr. Rohan Desai", "Mrs. Neha Bhat",
  "Mr. Suresh Gupta", "Mrs. Anjali Nair", "Mr. Vikash Kumar", "Mrs. Divya Sharma",
  "Mr. Arjun Reddy", "Mrs. Meera Pillai", "Mr. Harsh Malhotra", "Mrs. Priyanka Das",
  "Mr. Sanjay Verma", "Mrs. Isha Khan", "Mr. Aditya Singh", "Mrs. Pooja Desai",
  "Mr. Ramesh Nair", "Mrs. Shreya Gupta", "Mr. Nitin Sharma", "Mrs. Ananya Patel",
  "Mr. Vikram Singh", "Mrs. Ritika Joshi",
];

const subjects = [
  "Mathematics", "Science", "English", "Hindi", "Social Science",
  "Computer Science", "Physical Education", "Art", "Music",
];

const classes = ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B"];

export const teachers = teacherNames.map((name, i) => ({
  id: i + 1,
  name,
  subject: subjects[i % subjects.length],
  classes: classes.slice(i % 5, (i % 5) + 3), // Each teacher handles 3 classes
  email: `${name.toLowerCase().replace(/\s+/g, ".")}.teacher@ktc.edu`,
  phone: `987654${String(5000 + i).padStart(5, "0")}`,
  experience: 3 + Math.floor(Math.random() * 20),
}));

export const classData = classes.map((className) => ({
  id: className,
  name: className,
  classIncharge: teacherNames[Math.floor(Math.random() * teacherNames.length)],
  studentCount: 43 + Math.floor(Math.random() * 8),
  totalStrength: 43 + Math.floor(Math.random() * 8),
}));

console.log(`Total teachers: ${teachers.length}`);
console.log(`Total classes: ${classData.length}`);
