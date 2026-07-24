import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";

export const getDashboard = async (
    req,
    res,
    next
) => {
    try {
        const userId = req.user._id;

        const totalDocuments =
            await Document.countDocuments({
                user: userId
            });

        const totalFlashcards =
            await FlashCard.countDocuments({
                userId
            });

        const reviewedFlashcards =
            await FlashCard.countDocuments({
                userId,
                reviewCount: {
                    $gt: 0
                }
            });

        const starredFlashcards =
            await FlashCard.countDocuments({
                userId,
                starred: true
            });

        const totalQuizzes =
            await Quiz.countDocuments({
                userId
            });

        const completedQuizzes =
            await Quiz.countDocuments({
                userId,
                completed: true
            });

        const completedQuizData =
            await Quiz.find({
                userId,
                completed: true
            });

        const averageScore =
            completedQuizData.length === 0
                ? 0
                : Math.round(
                    completedQuizData.reduce(
                        (sum, quiz) =>
                            sum +
                            quiz.percentage,
                        0
                    ) /
                    completedQuizData.length
                );

        const recentDocuments =
            await Document.find({
                user: userId
            })
                .sort({
                    updatedAt: -1
                })
                .limit(5)
                .select(
                    "title status createdAt"
                );

        const recentQuizzes =
            await Quiz.find({
                userId
            })
                .sort({
                    createdAt: -1
                })
                .limit(5)
                .populate(
                    "documentId",
                    "title"
                );

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore
                },

                recentActivity: {
                    documents:
                        recentDocuments,
                    quizzes:
                        recentQuizzes
                }
            }
        });
    } catch (error) {
        next(error);
    }
};