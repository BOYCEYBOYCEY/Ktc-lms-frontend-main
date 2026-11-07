import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Outlet />;

    // Redirect authenticated users
    if (user?.role === "user") return <Navigate to="/student" replace />;
    if (user?.role === "teacher") return <Navigate to="/teacher" replace />;
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "superAdmin")
        return <Navigate to="/super-admin" replace />;

    return <Navigate to="/login" replace />;
}
