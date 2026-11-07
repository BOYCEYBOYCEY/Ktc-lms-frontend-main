// resources/js/components/dashboard/DashboardLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
import { FaBell, FaUserCircle, FaEnvelope } from "react-icons/fa";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useAuth(); // Assuming logout is available in context
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm z-10 relative">
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 focus:outline-none lg:hidden"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        {/* Right Section: Icons */}
                        <div className="flex items-center space-x-7 ml-auto">
                            {/* Messages */}
                            <button className="text-gray-600 hover:text-blue-500 relative">
                                <FaEnvelope size={20} />
                            </button>

                            {/* Notifications */}
                            <button className="text-gray-600 hover:text-blue-500 relative">
                                <FaBell size={20} />
                            </button>

                            {/* Profile */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                    className="text-gray-600 hover:text-blue-500 flex items-center space-x-1"
                                >
                                    <FaUserCircle size={24} />
                                    <span className="hidden sm:block">
                                        {user?.name}
                                    </span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-25 bg-white rounded-md shadow-lg border py-1 z-50">
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
