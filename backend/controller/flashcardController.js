import mongoose from "mongoose";
import FlashCard from "../models/FlashCard.js";
import Document from "../models/Document.js";

/**
 * @desc Get all flashcards for current user
 * @route GET /api/flashcards
 * @access Private
 */
export const getAllFlashcards = async (req, res, next) => {
    try {
        const flashcards = await FlashCard.find({
            userId: req.user._id
        })
            .populate("documentId", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: flashcards.length,
            flashcards
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get flashcards for a specific document
 * @route GET /api/flashcards/:documentId
 * @access Private
 */
export const getFlashcards = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid document ID"
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found"
            });
        }

        const flashcards = await FlashCard.find({
            userId: req.user._id,
            documentId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            document: {
                id: document._id,
                title: document.title
            },
            count: flashcards.length,
            flashcards
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Review a flashcard
 * @route PUT /api/flashcards/:cardId/review
 * @access Private
 */
export const reviewFlashcards = async (req, res, next) => {
    try {
        const { cardId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cardId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid flashcard ID"
            });
        }

        const flashcard = await FlashCard.findOne({
            _id: cardId,
            userId: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({
                success: false,
                error: "Flashcard not found"
            });
        }

        flashcard.reviewCount += 1;
        flashcard.lastReviewed = new Date();

        // Simple spaced repetition logic
        const intervals = [1, 3, 7, 14, 30, 60];

        const mastery = Math.min(
            flashcard.masteryLevel + 1,
            5
        );

        flashcard.masteryLevel = mastery;

        const nextReview = new Date();
        nextReview.setDate(
            nextReview.getDate() + intervals[mastery]
        );

        flashcard.nextReview = nextReview;

        await flashcard.save();

        res.status(200).json({
            success: true,
            message: "Flashcard reviewed successfully",
            flashcard
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Star or unstar a flashcard
 * @route PUT /api/flashcards/:cardId/star
 * @access Private
 */
export const toggleStarFlashcards = async (req, res, next) => {
    try {
        const { cardId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cardId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid flashcard ID"
            });
        }

        const flashcard = await FlashCard.findOne({
            _id: cardId,
            userId: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({
                success: false,
                error: "Flashcard not found"
            });
        }

        flashcard.starred = !flashcard.starred;

        await flashcard.save();

        res.status(200).json({
            success: true,
            starred: flashcard.starred,
            flashcard
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Delete all flashcards for a document
 * @route DELETE /api/flashcards/:id
 * @access Private
 */
export const deleteFlashcardSet = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid document ID"
            });
        }

        const deleted = await FlashCard.deleteMany({
            documentId: id,
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: `${deleted.deletedCount} flashcards deleted`,
            deletedCount: deleted.deletedCount
        });

    } catch (error) {
        next(error);
    }
};