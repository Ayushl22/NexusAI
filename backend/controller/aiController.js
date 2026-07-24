import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";

import * as geminiService from "../utils/geminiService.js";
import { chunkText } from "../utils/textChunker.js";

/**
 * Generate Flashcards
 * POST /api/ai/generate-flashcards
 */
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        const document = await Document.findOne({
            _id: documentId,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const flashcardsData = await geminiService.generateFlashcards(
            document.extractedText
        );

        const flashcards = flashcardsData.map(card => ({
            userId: req.user._id,
            documentId,
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty || "medium"
        }));

        const savedFlashcards = await FlashCard.insertMany(flashcards);

        res.status(201).json({
            success: true,
            count: savedFlashcards.length,
            flashcards: savedFlashcards
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Generate Quiz
 * POST /api/ai/generate-quiz
 */
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        const document = await Document.findOne({
            _id: documentId,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const quizData = await geminiService.generateQuiz(
            document.extractedText
        );

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId,
            title: `${document.title} Quiz`,
            totalQuestions: quizData.questions.length,
            questions: quizData.questions
        });

        res.status(201).json({
            success: true,
            quiz
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Generate Summary
 * POST /api/ai/generate-summary
 */
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        const document = await Document.findOne({
            _id: documentId,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const summary = await geminiService.generateSummary(
            document.extractedText
        );

        res.status(200).json({
            success: true,
            summary
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Chat with Document
 * POST /api/ai/chat
 */
export const chat = async (req, res, next) => {
    try {
        const { documentId, message } = req.body;

        const document = await Document.findOne({
            _id: documentId,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // FIX: chunkText is synchronous, pass proper numeric boundaries, 
        // and extract 'content' from the returning array of objects.
        const chunks = chunkText(document.extractedText, 500, 50);
        const context = chunks.map(c => c.content).join("\n\n");

        // Find or create a singular ChatHistory document for this session
        let chatRecord = await ChatHistory.findOne({
            user: req.user._id,
            documentId
        });

        if (!chatRecord) {
            chatRecord = await ChatHistory.create({
                user: req.user._id,
                documentId,
                title: `${document.title} Chat`,
                messages: []
            });
        }

        // Get AI generated response passing context and document instance
        const answer = await geminiService.chatWithDocument(
            message,
            context,
            chatRecord
        );

        // Update subdocument messages log array
        chatRecord.messages.push({ role: "user", content: message });
        chatRecord.messages.push({ role: "assistant", content: answer });
        await chatRecord.save();

        res.status(200).json({
            success: true,
            chat: chatRecord
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Explain Concept
 * POST /api/ai/explain-concept
 */
export const explainConcept = async (req, res, next) => {
    try {
        const { concept, documentId } = req.body;

        let context = "";

        if (documentId) {
            const document = await Document.findOne({
                _id: documentId,
                user: req.user._id
            });

            if (document) {
                // FIX: Removed await (chunkText is sync), fixed parameters, and mapped contents
                const chunks = chunkText(document.extractedText, 500, 50);
                context = chunks.map(c => c.content).join("\n\n");
            }
        }

        const explanation = await geminiService.explainConcept(
            concept,
            context
        );

        res.status(200).json({
            success: true,
            concept,
            explanation
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get Chat History
 * GET /api/ai/chat-history/:documentId
 */
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        // Fetch user's corresponding document to dynamically check title matching
        const document = await Document.findOne({
            _id: documentId,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document context reference not found"
            });
        }

        // Find historical log matching current reference pattern
        const chatRecord = await ChatHistory.findOne({
            user: req.user._id,
            documentId
        });

        res.status(200).json({
            success: true,
            history: chatRecord ? chatRecord.messages : []
        });

    } catch (error) {
        next(error);
    }
};