// resources/js/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    console.log("AuthProvider →", isAuthenticated);

    // Load from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setIsAuthenticated(true);
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (token, user) => {
        setIsAuthenticated(true);
        setToken(token);
        setUser(user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, token, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
