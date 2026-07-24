// src/context/AuthContext.jsx

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response =
                    await authService.getProfile();

                setUser(response.user);
            } catch (error) {
                console.error(
                    "Authentication error:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (
        email,
        password
    ) => {
        const response =
            await authService.login(
                email,
                password
            );

        setUser(response.user);

        return response;
    };

    const register = async (
        username,
        email,
        password
    ) => {
        const response =
            await authService.register(
                username,
                email,
                password
            );

        setUser(response.user);

        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (
        data
    ) => {
        const response =
            await authService.updateProfile(
                data
            );

        setUser(response.user);

        return response;
    };

    const changePassword =
        async (
            currentPassword,
            newPassword
        ) => {
            return await authService.changePassword(
                currentPassword,
                newPassword
            );
        };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return context;
};

export default AuthContext;