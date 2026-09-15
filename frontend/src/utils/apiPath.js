const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Vercel uses same-origin /api requests. Local Vite development keeps working
// out of the box, and VITE_API_URL can override either environment.
export const BASE_URL = configuredApiUrl ||
    (import.meta.env.DEV ? "http://localhost:8000" : "");

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
        CHANGE_PASSWORD:
            "/api/auth/change-password",
    },

    DOCUMENTS: {
        UPLOAD:
            "/api/documents/upload",

        GET_DOCUMENTS:
            "/api/documents",

        GET_DOCUMENT_BY_ID:
            (id) =>
                `/api/documents/${id}`,

        UPDATE_DOCUMENT:
            (id) =>
                `/api/documents/${id}`,

        DELETE_DOCUMENT:
            (id) =>
                `/api/documents/${id}`,
    },

    AI: {
        GENERATE_FLASHCARDS:
            "/api/ai/generate-flashcards",

        GENERATE_QUIZ:
            "/api/ai/generate-quiz",

        GENERATE_SUMMARY:
            "/api/ai/generate-summary",

        CHAT:
            "/api/ai/chat",

        EXPLAIN_CONCEPT:
            "/api/ai/explain-concept",

        GET_CHAT_HISTORY:
            (documentId) =>
                `/api/ai/chat-history/${documentId}`,
    },

    FLASHCARDS: {
        GET_ALL:
            "/api/flashcards",

        GET_BY_DOCUMENT:
            (documentId) =>
                `/api/flashcards/${documentId}`,

        REVIEW:
            (cardId) =>
                `/api/flashcards/${cardId}/review`,

        STAR:
            (cardId) =>
                `/api/flashcards/${cardId}/star`,

        DELETE:
            (documentId) =>
                `/api/flashcards/${documentId}`,
    },

    QUIZZES: {
        GET_ALL:
            "/api/quizzes",

        HISTORY:
            "/api/quizzes/history",

        GET_BY_ID:
            (quizId) =>
                `/api/quizzes/${quizId}`,

        SUBMIT:
            (quizId) =>
                `/api/quizzes/${quizId}/submit`,

        DELETE:
            (quizId) =>
                `/api/quizzes/${quizId}`,
    },
    PROGRESS: {
        DASHBOARD: "/api/progress/dashboard",
    },
};

export default API_PATHS;
