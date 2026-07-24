import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

// Protected Route Wrapper (Corrected folder: /components/auth/)
import ProtectedRoute from "./components/auth/ProtectedRoutes";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";

// Documents
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";

// Flashcards
import FlashcardsListPage from "./pages/FlashCards/FlashcardListPage";
import FlashcardPage from "./pages/FlashCards/FlashcardPage";

// Quizzes (Corrected folder: capital 'Q' in /Quizzes/)
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";

// Profile (Corrected folder: capital 'P' in /Profile/)
import ProfilePage from "./pages/Profile/ProfilePage";

// Not Found
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
    const {
        isAuthenticated,
        loading
    } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <Router>
            <Routes>

                {/* Root Redirect */}
                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                />

                {/* Public Routes */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/documents"
                        element={<DocumentListPage />}
                    />

                    <Route
                        path="/documents/:id"
                        element={<DocumentDetailPage />}
                    />

                    <Route
                        path="/flashcards"
                        element={<FlashcardsListPage />}
                    />

                    <Route
                        path="/documents/:id/flashcards"
                        element={<FlashcardPage />}
                    />

                    <Route
                        path="/quizzes/:quizId"
                        element={<QuizTakePage />}
                    />

                    <Route
                        path="/quizzes/:quizId/results"
                        element={<QuizResultPage />}
                    />

                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />
                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Routes>
        </Router>
    );
};

export default App;
