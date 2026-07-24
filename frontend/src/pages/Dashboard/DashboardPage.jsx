import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Layers,
    ClipboardList,
    Star,
    TrendingUp,
    Upload,
} from "lucide-react";
import { getDashboard } from "../../services/progressService";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getDashboard();
                setData(response.data);
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    const overview = data?.overview || {};

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Your learning progress at a glance
                    </p>
                </div>
                <Link
                    to="/documents"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                >
                    <Upload className="w-4 h-4" />
                    Upload Document
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={FileText}
                    label="Documents"
                    value={overview.totalDocuments || 0}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={Layers}
                    label="Flashcards"
                    value={overview.totalFlashcards || 0}
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    icon={ClipboardList}
                    label="Quizzes Completed"
                    value={overview.completedQuizzes || 0}
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Average Score"
                    value={`${overview.averageScore || 0}%`}
                    color="bg-orange-50 text-orange-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Documents
                    </h2>
                    {data?.recentActivity?.documents?.length > 0 ? (
                        <div className="space-y-3">
                            {data.recentActivity.documents.map((doc) => (
                                <Link
                                    key={doc._id}
                                    to={`/documents/${doc._id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-800">
                                            {doc.title}
                                        </span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        doc.status === "processed"
                                            ? "bg-green-50 text-green-600"
                                            : doc.status === "failed"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-yellow-50 text-yellow-600"
                                    }`}>
                                        {doc.status}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No documents yet. Upload one to get started!
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Quizzes
                    </h2>
                    {data?.recentActivity?.quizzes?.length > 0 ? (
                        <div className="space-y-3">
                            {data.recentActivity.quizzes.map((quiz) => (
                                <Link
                                    key={quiz._id}
                                    to={
                                        quiz.completed
                                            ? `/quizzes/${quiz._id}/results`
                                            : `/quizzes/${quiz._id}`
                                    }
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {quiz.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {quiz.documentId?.title}
                                        </p>
                                    </div>
                                    {quiz.completed && (
                                        <span className="text-sm font-semibold text-primary">
                                            {quiz.percentage}%
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No quizzes yet. Generate one from a document!
                        </p>
                    )}
                </div>
            </div>

            {(overview.reviewedFlashcards > 0 || overview.starredFlashcards > 0) && (
                <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Flashcard Progress
                    </h2>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Layers className="w-4 h-4" />
                            {overview.reviewedFlashcards} reviewed
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {overview.starredFlashcards} starred
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
