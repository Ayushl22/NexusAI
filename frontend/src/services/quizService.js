import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const getQuizzes =
    async () => {
        const response =
            await axiosInstance.get(
                API_PATHS.QUIZZES.GET_ALL
            );

        return response.data;
    };

export const getQuiz = async (
    quizId
) => {
    const response =
        await axiosInstance.get(
            API_PATHS.QUIZZES.GET_BY_ID(
                quizId
            )
        );

    return response.data;
};

export const submitQuiz =
    async (
        quizId,
        answers,
        timeSpent
    ) => {
        const response =
            await axiosInstance.post(
                API_PATHS.QUIZZES.SUBMIT(
                    quizId
                ),
                {
                    answers,
                    timeSpent,
                }
            );

        return response.data;
    };

export const deleteQuiz =
    async (quizId) => {
        const response =
            await axiosInstance.delete(
                API_PATHS.QUIZZES.DELETE(
                    quizId
                )
            );

        return response.data;
    };

export const getQuizHistory =
    async () => {
        const response =
            await axiosInstance.get(
                API_PATHS.QUIZZES.HISTORY
            );

        return response.data;
    };