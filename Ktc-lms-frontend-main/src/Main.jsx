
import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import DashboardLayout from "./components/Dashboard/DashboardLayput";
import ErrorBoundary from "./components/ErrorBoundary";

import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute"; //
import { AuthProvider } from "./context/AuthContext";


import StudentHome from "./components/Dashboard/StudentHome";
import TeacherHome from "./components/Dashboard/TeacherHome";
import AdminHome from "./components/Dashboard/AdminHome";
import StudentDetailPage from "./components/Dashboard/StudentDetailPage";
import ClassDetailPage from "./components/Dashboard/ClassDetailPage";
import AtRiskListPage from "./components/Dashboard/AtRiskListPage";
import LiveClass from "./components/Dashboard/LiveClass";
import Messages from "./components/Dashboard/Messages";
import AddClassSections from "./components/Dashboard/Admin/AddClassSections";
import TeacherAttendance from "./components/Dashboard/TeacherAttendance";
import TeacherMarks from "./components/Dashboard/TeacherMarks";
import ParentHome from "./components/Dashboard/ParentHome";
import FeeDetails from "./components/Dashboard/FeeDetails";
import PaymentHistory from "./components/Dashboard/PaymentHistory";
import AdminFeesDashboard from "./components/Dashboard/AdminFeesDashboard";
import FeeWaiverApproval from "./components/Dashboard/Admin/FeeWaiverApproval";
import FeeWaiverRequest from "./components/Dashboard/FeeWaiverRequest";
import ParentLedger from "./components/Dashboard/ParentLedger";
import AdminLedgerViewer from "./components/Dashboard/AdminLedgerViewer";

export default function Main() {

    console.log("I am inside Choot");

    return (
        <ErrorBoundary>
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

                    {/* Parent */}
                    <Route element={<PrivateRoute allowedRoles={["parent"]} />}>
                        <Route path="/parent/*" element={<DashboardLayout />}>
                            <Route index element={<ParentHome />} />
                            <Route path="fees/:studentId" element={<FeeDetails />} />
                            <Route path="payment-history/:studentId" element={<PaymentHistory />} />
                            <Route path="ledger" element={<ParentLedger />} />
                            <Route path="ledger/:studentId" element={<ParentLedger />} />
                            <Route path="waiver-request/:studentId" element={<FeeWaiverRequest />} />
                            <Route path="messages" element={<Messages />} />
                        </Route>
                    </Route>

                    {/* Admin */}
                    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin/*" element={<DashboardLayout />}>
                            <Route index element={<AdminHome />} />
                            <Route path="live-class" element={<LiveClass />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="add-class" element={<AddClassSections />} />
                            <Route path="class/:className" element={<ClassDetailPage />} />
                            <Route path="fees" element={<AdminFeesDashboard />} />
                            <Route path="ledger" element={<AdminLedgerViewer />} />
                            <Route path="waiver-approvals" element={<FeeWaiverApproval />} />
                        </Route>
                    </Route>

                    {/* Teacher */}
                    <Route
                        element={<PrivateRoute allowedRoles={["teacher"]} />}
                    >
                        <Route path="/teacher/*" element={<DashboardLayout />}>
                            <Route index element={<TeacherHome />} />
                            <Route path="attendance" element={<TeacherAttendance />} />
                            <Route path="marks" element={<TeacherMarks />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="student/:studentId" element={<StudentDetailPage />} />
                            <Route path="class/:className" element={<ClassDetailPage />} />
                            <Route path="at-risk-list" element={<AtRiskListPage />} />
                        </Route>
                    </Route>

                    {/* SuperAdmin - Redirect to Admin for now */}
                    <Route
                        path="/super-admin/*"
                        element={<Navigate to="/admin" replace />}
                    />

                    {/* Catch all - Redirect to login */}
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
