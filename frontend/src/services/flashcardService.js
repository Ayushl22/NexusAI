import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const getAllFlashcards =
    async () => {
        const response =
            await axiosInstance.get(
                API_PATHS.FLASHCARDS.GET_ALL
            );

        return response.data;
    };

export const getFlashcards =
    async (documentId) => {
        const response =
            await axiosInstance.get(
                API_PATHS.FLASHCARDS.GET_BY_DOCUMENT(
                    documentId
                )
            );

        return response.data;
    };

export const reviewFlashcard =
    async (cardId) => {
        const response =
            await axiosInstance.put(
                API_PATHS.FLASHCARDS.REVIEW(
                    cardId
                )
            );

        return response.data;
    };

export const toggleStarFlashcard =
    async (cardId) => {
        const response =
            await axiosInstance.put(
                API_PATHS.FLASHCARDS.STAR(
                    cardId
                )
            );

        return response.data;
    };

export const deleteFlashcardSet =
    async (documentId) => {
        const response =
            await axiosInstance.delete(
                API_PATHS.FLASHCARDS.DELETE(
                    documentId
                )
            );

        return response.data;
    };