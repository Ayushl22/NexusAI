import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const getAIErrorMessage = (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 503) {
        return serverMessage || "AI is busy right now. Please try again in a moment.";
    }

    return serverMessage || "The AI request failed. Please try again.";
};

export const generateFlashcards =
    async (documentId) => {
        const response =
            await axiosInstance.post(
                API_PATHS.AI
                    .GENERATE_FLASHCARDS,
                { documentId }
            );

        return response.data;
    };

export const generateQuiz =
    async (documentId) => {
        const response =
            await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUIZ,
                { documentId }
            );

        return response.data;
    };

export const generateSummary =
    async (documentId) => {
        const response =
            await axiosInstance.post(
                API_PATHS.AI
                    .GENERATE_SUMMARY,
                { documentId }
            );

        return response.data;
    };

export const chat = async (
    documentId,
    message
) => {
    const response =
        await axiosInstance.post(
            API_PATHS.AI.CHAT,
            {
                documentId,
                message,
            }
        );

    return response.data;
};

export const explainConcept =
    async (
        concept,
        documentId
    ) => {
        const response =
            await axiosInstance.post(
                API_PATHS.AI
                    .EXPLAIN_CONCEPT,
                {
                    concept,
                    documentId,
                }
            );

        return response.data;
    };

export const getChatHistory =
    async (documentId) => {
        const response =
            await axiosInstance.get(
                API_PATHS.AI.GET_CHAT_HISTORY(
                    documentId
                )
            );

        return response.data;
    };
