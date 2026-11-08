// resources/js/components/Layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMenuItems } from "../../config/menuItem";

export default function Sidebar({ isOpen, onClose, children }) {
    const { user } = useAuth();
    const menuItems = getMenuItems(user.role);

    return (
        <div className="flex h-screen">
            {/* Sidebar overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 z-30 w-64 bg-[#323232] text-white shadow-xl transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    lg:translate-x-0 lg:h-screen`}
            >
                <div className="flex flex-col h-screen">
                    {/* Header */}
                    <div className="flex items-center justify-center h-16 px-4 bg-[#2a2a2a] border-b border-gray-700">
                        <h1 className="text-xl font-semibold text-white text-center">
                            {user?.role === "teacher"
                                ? "Teacher"
                                : user?.role === "user"
                                ? "Student"
                                : user?.role === "admin"
                                ? "Admin"
                                : user?.role === "superAdmin"
                                ? "Super Admin"
                                : user?.role === "parent"
                                ? "Parent"
                                : ""}{" "}
                            Dashboard
                        </h1>
                    </div>

                    {/* Menu */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 transition-colors duration-200">
                        <nav className="px-2 py-4">
                            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Menu
                            </h3>
                            <ul className="space-y-1">
                                {menuItems.map((item) => {
                                    // Convert relative paths to absolute paths within the role context
                                    const getFullPath = () => {
                                        if (item.path === "/") return "/";
                                        if (user?.role === "teacher") return `/teacher/${item.path}`;
                                        if (user?.role === "admin") return `/admin/${item.path}`;
                                        if (user?.role === "user") return `/student/${item.path}`;
                                        if (user?.role === "parent") return `/parent/${item.path}`;
                                        if (user?.role === "superAdmin") return `/superadmin/${item.path}`;
                                        return item.path;
                                    };

                                    return (
                                        <li key={item.path}>
                                            <NavLink
                                                to={getFullPath()}
                                                end={item.path === "/"}
                                                className={({ isActive }) =>
                                                    `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                                                        isActive
                                                            ? "bg-gray-700 text-white shadow-md"
                                                            : "text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
                                                    }`
                                                }
                                            >
                                                <item.icon className="w-5 h-5 mr-3" />
                                                {item.title}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 lg:ml-64 overflow-auto h-screen bg-gray-50">
                {children}
            </div>
        </div>
    );
}
