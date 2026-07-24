import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../layout/Layout";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        );
    }

    return isAuthenticated
        ? <Layout />
        : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
