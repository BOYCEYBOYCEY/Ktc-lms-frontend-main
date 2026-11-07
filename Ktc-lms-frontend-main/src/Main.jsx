
import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import DashboardLayout from "./components/Dashboard/DashboardLayput";

import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute"; //
import { AuthProvider } from "./context/AuthContext";


import StudentHome from "./components/Dashboard/StudentHome";
import TeacherHome from "./components/Dashboard/TeacherHome";
import AdminHome from "./components/Dashboard/AdminHome";
import LiveClass from "./components/Dashboard/LiveClass";
import Messages from "./components/Dashboard/Messages";
import AddClassSections from "./components/Dashboard/Admin/AddClassSections";

export default function Main() {

    console.log("I am inside Choot");

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Default redirect */}
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    {/* Public login */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                    </Route>

                    {/* Student */}
                    <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                        <Route path="/student/*" element={<DashboardLayout />}>
                            <Route index element={<StudentHome />} />
                            <Route path="live-class" element={<LiveClass />} />
                            <Route path="messages" element={<Messages />} />
                        </Route>
                    </Route>

                    {/* Teacher */}
                    <Route
                        element={<PrivateRoute allowedRoles={["teacher"]} />}
                    >
                        <Route path="/teacher/*" element={<DashboardLayout />}>
                            <Route index element={<TeacherHome />} />
                            <Route path="live-class" element={<LiveClass />} />
                            <Route path="messages" element={<Messages />} />
                        </Route>
                    </Route>

                    {/* Admin */}
                    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin/*" element={<DashboardLayout />}>
                            <Route index element={<AdminHome />} />
                            <Route path="live-class" element={<LiveClass />} />
                            <Route path="messages" element={<Messages />} />
                            <Route
                                path="add-class"
                                element={<AddClassSections />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
