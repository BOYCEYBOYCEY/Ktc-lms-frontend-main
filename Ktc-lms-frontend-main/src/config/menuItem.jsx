// menuItem.js
import {
    MdDashboard,
    MdLiveTv,
    MdAssignment,
    MdNotifications,
    MdBarChart,
    MdPeople,
    MdMessage,
    MdBook,
    MdSettings,
    MdHelp,
    MdReceipt,
} from "react-icons/md";

export const adminMenuItems = [
    { title: "Dashboard", path: "/", icon: MdDashboard },
    { title: "Subject", path: "/", icon: MdDashboard },
    { title: "Live Class", path: "live-class", icon: MdLiveTv },
    { title: "Standards", path: "live-class", icon: MdLiveTv },
    { title: "Add Exam", path: "live-class", icon: MdLiveTv },
    { title: "Analytics", path: "setting", icon: MdSettings },
    { title: "Teacher", path: "assignment", icon: MdAssignment },
    { title: "Student", path: "notification", icon: MdNotifications },
    { title: "Fee", path: "fees", icon: MdPeople },
    { title: "Fee Ledger", path: "ledger", icon: MdReceipt },
    { title: "Syllabus", path: "messages", icon: MdMessage },
    { title: "Time Table", path: "messages", icon: MdMessage },
    { title: "Homework", path: "messages", icon: MdMessage },
    { title: "Attendance", path: "messages", icon: MdMessage },
    { title: "Quiz", path: "messages", icon: MdMessage },
    { title: "Peformance", path: "messages", icon: MdMessage },
    { title: "Library", path: "messages", icon: MdMessage },
    { title: "Announcement", path: "messages", icon: MdMessage },
    { title: "Arrangement", path: "messages", icon: MdMessage },
    { title: "Report Card", path: "messages", icon: MdMessage },
    { title: "Calendar", path: "messages", icon: MdMessage },
    { title: "ID Card", path: "messages", icon: MdMessage },
    { title: "Admit Card", path: "messages", icon: MdMessage },
    { title: "Rules & Regulation", path: "messages", icon: MdMessage },
    { title: "Enquiry", path: "messages", icon: MdMessage },
    { title: "Results", path: "results", icon: MdBarChart },
    { title: "Portal Website", path: "syllabus", icon: MdBook },
    { title: "Help & Support", path: "help", icon: MdHelp },
    { title: "Add Class & Sections", path: "add-class", icon: MdHelp },
];

export const teacherMenuItems = [
    { title: "Dashboard", path: "/", icon: MdDashboard },
    { title: "Attendance", path: "attendance", icon: MdAssignment },
    { title: "Marks", path: "marks", icon: MdBarChart },
    { title: "Assignments", path: "assignments", icon: MdAssignment },
    { title: "Messages", path: "messages", icon: MdMessage },
];

export const superAdminMenuItems = [
    { title: "Dashboard", path: "/", icon: MdDashboard },
    { title: "Live Class", path: "live-class", icon: MdLiveTv },
    { title: "Assignment", path: "assignment", icon: MdAssignment },
    { title: "Notification", path: "notification", icon: MdNotifications },
    { title: "Results", path: "results", icon: MdBarChart },
    { title: "Chesmate", path: "chesmate", icon: MdPeople },
    { title: "Messages", path: "messages", icon: MdMessage },
    { title: "Syllabus", path: "syllabus", icon: MdBook },
    { title: "Setting", path: "setting", icon: MdSettings },
    { title: "Help & Support", path: "help", icon: MdHelp },
];

export const studentMenuItems = [
    { title: "Dashboard", path: "/", icon: MdDashboard },
    { title: "Live Class", path: "live-class", icon: MdLiveTv },
    { title: "Assignments", path: "assignments", icon: MdAssignment },
    { title: "Notifications", path: "notifications", icon: MdNotifications },
    { title: "Results", path: "results", icon: MdBarChart },
    { title: "Messages", path: "messages", icon: MdMessage },
    { title: "Syllabus", path: "syllabus", icon: MdBook },
    { title: "Help & Support", path: "help", icon: MdHelp },
];

export const parentMenuItems = [
    { title: "Dashboard", path: "/", icon: MdDashboard },
    { title: "Fee Ledger", path: "ledger", icon: MdReceipt },
    { title: "Messages", path: "messages", icon: MdMessage },
];

export const getMenuItems = (role) => {
    switch (role) {
        case "admin":
            return adminMenuItems;
        case "teacher":
            return teacherMenuItems;
        case "superAdmin":
            return superAdminMenuItems;
        case "user":
            return studentMenuItems;
        case "parent":
            return parentMenuItems;
        default:
            return [];
    }
};
