import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { Eye, EyeOff } from "lucide-react";
import Logo from "../../../src/assets/Logo/KtcWhite.png";

import TeacherAvtar from "../../../src/assets/Images/TeacherAvtar.jpg";

import StudentAvtar from "../../../src/assets/Images/TeacherAvtar.jpg";
import AdminAvtar from "../../../src/assets/Images/TeacherAvtar.jpg";

import SuperAdminAvtar from "../../../src/assets/Images/TeacherAvtar.jpg";
import { useAuth } from "../../context/AuthContext"

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { config } from "../../config";

const TEST_CREDENTIALS = {
    admin: { email: "admin@ktc.com", password: "admin123", role: "admin" },
    teacher: { email: "teacher@ktc.com", password: "teacher123", role: "teacher" },
    student: { admission_number: "STU001", password: "student123", role: "student" },
    superAdmin: { email: "superadmin@ktc.com", password: "superadmin123", role: "superAdmin" },
};

const Login = () => {
    console.log(" I am inside  Login component");

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        admission_number: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const fillTestCredentials = (role) => {
        handleUserTypeSelect(role);
        const creds = TEST_CREDENTIALS[role];
        if (role === "student") {
            setFormData({
                email: "",
                password: creds.password,
                admission_number: creds.admission_number,
            });
        } else {
            setFormData({
                email: creds.email,
                password: creds.password,
                admission_number: "",
            });
        }
    };

    useEffect(() => {
        console.log("API Base URL:", config.API_BASE_URL);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        // Reset fields when switching role
        setFormData({ email: "", password: "", admission_number: "" });
    };

    const getMockResponse = (userType, email, admission_number) => {
        // Mock responses for frontend testing
        const mockTokens = {
            admin: "mock_admin_token_" + Date.now(),
            teacher: "mock_teacher_token_" + Date.now(),
            student: "mock_student_token_" + Date.now(),
            superAdmin: "mock_superadmin_token_" + Date.now(),
        };

        const mockUsers = {
            admin: { id: 1, name: "Admin User", email, role: "admin" },
            teacher: { id: 2, name: "Teacher User", email, role: "teacher" },
            student: { id: 3, name: "Student User", admission_number, role: "user" },
            superAdmin: { id: 4, name: "Super Admin User", email, role: "superAdmin" },
        };

        return {
            success: true,
            data: {
                token: mockTokens[userType],
                user: mockUsers[userType],
            },
        };
    };

    const handleSubmit = async () => {
        setError("");

        if (!formData.password) {
            setError("Please enter password");
            return;
        }

        // Build request body based on role
        let requestBody = {};
        if (userType === "student") {
            if (!formData.admission_number) {
                setError("Please enter admission number");
                return;
            }
            requestBody = {
                admission_number: formData.admission_number,
                password: formData.password,
            };
        } else if (
            userType === "teacher" ||
            userType === "admin" ||
            userType === "superAdmin"
        ) {
            if (!formData.email) {
                setError("Please enter email");
                return;
            }
            requestBody = {
                email: formData.email,
                password: formData.password,
            };
        } else {
            setError("Please select a user type");
            return;
        }

        setLoading(true);

        try {
            let response;

            if (config.USE_MOCK_API) {
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 500));
                const data = getMockResponse(
                    userType,
                    formData.email,
                    formData.admission_number
                );
                response = { data };
            } else {
                let endpoint = "";
                switch (userType) {
                    case "teacher":
                        endpoint = config.TEACHER_LOGIN_ENDPOINT;
                        break;
                    case "student":
                        endpoint = config.STUDENT_LOGIN_ENDPOINT;
                        break;
                    case "admin":
                        endpoint = config.ADMIN_LOGIN_ENDPOINT;
                        break;
                    case "superAdmin":
                        endpoint = config.SUPER_ADMIN_LOGIN_ENDPOINT;
                        break;
                    default:
                        throw new Error("Invalid user type");
                }

                response = await axios.post(
                    `${config.API_BASE_URL}${endpoint}`,
                    requestBody,
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }

            const data = response.data?.data || response.data;
            if (response.data.success || data?.token) {
                const token = data.token;
                const user = data.user;

                if (!token || !user) {
                    throw new Error("Invalid response from server");
                }

                login(token, user);

                // Redirect based on role
                switch (user.role) {
                    case "admin":
                        navigate("/admin");
                        break;
                    case "teacher":
                        navigate("/teacher");
                        break;
                    case "user":
                        navigate("/student");
                        break;
                    case "superAdmin":
                        navigate("/super-admin");
                        break;
                    default:
                        navigate("/");
                }
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "An error occurred during login";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    const phoneVariants = {
        hover: {
            y: -10,
            rotate: -5,
            transition: {
                type: "spring",
                stiffness: 300,
            },
        },
    };

    const userCardVariants = {
        initial: { scale: 1 },
        selected: {
            scale: 1.05,
            boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "2px solid #049dd9",
        },
        hover: { scale: 1.03 },
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Background Image with Overlay */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"></div>
                {/* Overlay for better text readability */}
                <motion.div
                    className="absolute inset-0 bg-black bg-opacity-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                ></motion.div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full">
                    {/* Logo Section */}
                    <motion.div
                        className="mb-8 max-w-52 max-h-56"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <div className="flex items-center justify-center text-white">
                            <img src={Logo} alt="" />
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        className="text-center text-white mb-12 max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-3xl font-bold leading-tight">
                            Learning online is easier
                            <br />
                            than ever before with LMS!
                        </h1>
                    </motion.div>

                    {/* Mobile App Illustration */}
                    <motion.div
                        className="relative flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                    >
                        {/* Background circles */}
                        <motion.div
                            className="absolute -top-8 -left-8 w-32 h-32 bg-blue-500 bg-opacity-30 rounded-full"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.4, 0.3],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        ></motion.div>
                        <motion.div
                            className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500 bg-opacity-30 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2,
                            }}
                        ></motion.div>

                        {/* Central smartphone */}
                        <motion.div
                            className="relative z-10 w-64 h-96 bg-white rounded-3xl shadow-2xl p-4 flex items-center justify-center"
                            variants={phoneVariants}
                            whileHover="hover"
                        >
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex flex-col items-center justify-center p-6">
                                {/* App interface mockup */}
                                <motion.div
                                    className="w-16 h-16 bg-[#049dd9] rounded-full mb-4 flex items-center justify-center shadow-lg"
                                    animate={{
                                        y: [0, -5, 0],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                >
                                    <div className="text-white font-bold text-lg">
                                        K2C
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="text-xs text-gray-600 mb-6 font-semibold"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                >
                                    LMS Platform
                                </motion.div>

                                {/* Connection lines and icons */}
                                <div className="w-full space-y-3">
                                    <motion.div
                                        className="h-2 bg-gray-200 rounded w-3/4 mx-auto"
                                        animate={{
                                            width: ["75%", "85%", "75%"],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                        }}
                                    ></motion.div>
                                    <motion.div
                                        className="h-2 bg-gray-200 rounded w-1/2 mx-auto"
                                        animate={{
                                            width: ["50%", "60%", "50%"],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: 0.5,
                                        }}
                                    ></motion.div>
                                    <motion.div
                                        className="h-8 bg-[#000000] w-full mx-auto mt-6 shadow-sm"
                                        animate={{ height: [32, 36, 32] }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: 1,
                                        }}
                                    ></motion.div>
                                    <motion.div
                                        className="h-2 bg-gray-200 rounded w-2/3 mx-auto"
                                        animate={{
                                            width: ["66%", "76%", "66%"],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: 1.5,
                                        }}
                                    ></motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* People around the phone */}
                        <motion.div
                            className="absolute -left-12 top-8 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg"
                            animate={{
                                y: [0, -10, 0],
                                x: [0, -5, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        >
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">👤</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -right-12 top-16 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg"
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1,
                            }}
                        >
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">👤</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-4 -left-8 w-18 h-18 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg"
                            animate={{
                                y: [0, 10, 0],
                                x: [0, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 2,
                            }}
                        >
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">👤</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-700 mb-8">
                            Welcome to LMS!
                        </h2>

                        {/* User Type Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {/* Admin */}
                            <div
                                className={`flex flex-col items-center p-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                                    userType === "admin"
                                        ? "ring-2 ring-[#049dd9] rounded-lg"
                                        : ""
                                }`}
                                onClick={() => handleUserTypeSelect("admin")}
                            >
                                <img
                                    src={AdminAvtar}
                                    alt="Admin"
                                    className="w-[90px] h-[90px] rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-600 font-medium mt-2">
                                    Admin
                                </span>
                            </div>

                            {/* Teacher */}
                            <div
                                className={`flex flex-col items-center p-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                                    userType === "teacher"
                                        ? "ring-2 ring-[#049dd9] rounded-lg"
                                        : ""
                                }`}
                                onClick={() => handleUserTypeSelect("teacher")}
                            >
                                <img
                                    src={TeacherAvtar}
                                    alt="Teacher"
                                    className="w-[90px] h-[90px] rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-600 font-medium mt-2">
                                    Teacher
                                </span>
                            </div>

                            {/* Student */}
                            <div
                                className={`flex flex-col items-center p-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                                    userType === "student"
                                        ? "ring-2 ring-[#049dd9] rounded-lg"
                                        : ""
                                }`}
                                onClick={() => handleUserTypeSelect("student")}
                            >
                                <img
                                    src={StudentAvtar}
                                    alt="Student"
                                    className="w-[90px] h-[90px] rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-600 font-medium mt-2">
                                    Student
                                </span>
                            </div>

                            {/* Super Admin */}
                            <div
                                className={`flex flex-col items-center p-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                                    userType === "superAdmin"
                                        ? "ring-2 ring-[#049dd9] rounded-lg"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleUserTypeSelect("superAdmin")
                                }
                            >
                                <img
                                    src={SuperAdminAvtar}
                                    alt="Super Admin"
                                    className="w-[90px] h-[90px] rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-600 font-medium mt-2">
                                    Super Admin
                                </span>
                            </div>
                        </div>

                        {/* Quick Login Buttons (Dev/Test Only) */}
                        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <button
                                type="button"
                                onClick={() => fillTestCredentials("admin")}
                                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-1 px-2 rounded transition-colors"
                            >
                                Test: Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => fillTestCredentials("teacher")}
                                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-1 px-2 rounded transition-colors"
                            >
                                Test: Teacher
                            </button>
                            <button
                                type="button"
                                onClick={() => fillTestCredentials("student")}
                                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-1 px-2 rounded transition-colors"
                            >
                                Test: Student
                            </button>
                            <button
                                type="button"
                                onClick={() => fillTestCredentials("superAdmin")}
                                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-1 px-2 rounded transition-colors"
                            >
                                Test: SuperAdmin
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        {userType === "student" ? (
                            <input
                                type="text"
                                name="admission_number"
                                value={formData.admission_number}
                                onChange={handleInputChange}
                                placeholder="Admission Number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white"
                                required
                            />
                        ) : (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white"
                                required
                            />
                        )}

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12 bg-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-[#049dd9] to-[#000000] text-white py-3 px-4 rounded-lg font-medium hover:from-[#038dc3] hover:to-[#000000] focus:ring-2 focus:ring-[#049dd9] focus:ring-offset-2 transition-all duration-200 shadow-lg ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
