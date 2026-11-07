// resources/js/routes/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRoles }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // ✅ Role check
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />; // or a custom 403 page if you like
    }

    return <Outlet />;
}
