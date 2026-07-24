import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";

/**
 * @desc Get all quizzes of current user
 * @route GET /api/quizzes
 * @access Private
 */
export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id
        })
            .populate("documentId", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            quizzes
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get single quiz
 * @route GET /api/quizzes/:quizId
 * @access Private
 */
export const getQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid quiz ID"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            userId: req.user._id
        }).populate("documentId", "title");

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            quiz
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Submit quiz answers
 * @route POST /api/quizzes/:quizId/submit
 * @access Private
 */
export const submitQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const { answers, timeSpent } = req.body;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid quiz ID"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found"
            });
        }

        let score = 0;

        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index];

            question.userAnswer = userAnswer;
            question.isCorrect =
                userAnswer === question.correctAnswer;

            if (question.isCorrect) {
                score++;
            }
        });

        quiz.score = score;
        quiz.totalQuestions = quiz.questions.length;
        quiz.percentage = Math.round(
            (score / quiz.questions.length) * 100
        );

        quiz.completed = true;
        quiz.attempts += 1;
        quiz.timeSpent = timeSpent || 0;
        quiz.lastAttempted = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            score: quiz.score,
            totalQuestions: quiz.totalQuestions,
            percentage: quiz.percentage,
            quiz
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Delete quiz
 * @route DELETE /api/quizzes/:quizId
 * @access Private
 */
export const deleteQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid quiz ID"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found"
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Quiz statistics/history
 * @route GET /api/quizzes/history
 * @access Private
 */
export const getQuizHistory = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            completed: true
        })
            .populate("documentId", "title")
            .sort({ lastAttempted: -1 });

        const totalQuizzes = quizzes.length;

        const averageScore =
            totalQuizzes === 0
                ? 0
                : Math.round(
                    quizzes.reduce(
                        (sum, q) => sum + q.percentage,
                        0
                    ) / totalQuizzes
                );

        res.status(200).json({
            success: true,
            stats: {
                totalQuizzes,
                averageScore
            },
            quizzes
        });

    } catch (error) {
        next(error);
    }
};