import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";

import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";

import fs from "fs/promises";
import mongoose from "mongoose";

/**
 * @desc    Upload PDF document
 * @route   POST /api/documents/upload
 * @access  Private
 */
export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Please upload a PDF file",
                statusCode: 400
            });
        }

        const document = await Document.create({
            user: req.user._id,
            title: req.body.title || req.file.originalname,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            status: "processing",
            lastAccessed: Date.now()
        });

        try {
            // Extract text from PDF
            const pdfData = await extractTextFromPDF(req.file.path);

            // Generate chunks for AI processing
            const chunks = chunkText(pdfData.text);

            document.extractedText = pdfData.text;
            document.chunkCount = chunks.length;
            document.pageCount = pdfData.numPages;
            document.status = "processed";

            await document.save();

            res.status(201).json({
                success: true,
                message: "Document uploaded and processed successfully",
                document: {
                    id: document._id,
                    title: document.title,
                    fileName: document.originalName,
                    fileSize: document.fileSize,
                    pageCount: document.pageCount,
                    chunkCount: document.chunkCount,
                    status: document.status,
                    createdAt: document.createdAt
                }
            });
        } catch (processingError) {
            document.status = "failed";
            document.processingError = processingError.message;
            await document.save();

            throw processingError;
        }
    } catch (error) {
        // Remove uploaded file if processing fails
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        next(error);
    }
};

/**
 * @desc    Get all user documents
 * @route   GET /api/documents
 * @access  Private
 */
export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({
            user: req.user._id
        })
            .select("-extractedText")
            .sort({ createdAt: -1 });

        const documentsWithStats = await Promise.all(
            documents.map(async (document) => {
                const flashcardCount = await FlashCard.countDocuments({
                    documentId: document._id,
                    userId: req.user._id
                });

                const quizCount = await Quiz.countDocuments({
                    documentId: document._id,
                    userId: req.user._id
                });

                return {
                    ...document.toObject(),
                    flashcardCount,
                    quizCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: documentsWithStats.length,
            documents: documentsWithStats
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single document
 * @route   GET /api/documents/:id
 * @access  Private
 */
export const getDocument = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid document ID",
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statusCode: 404
            });
        }

        const flashcardCount = await FlashCard.countDocuments({
            documentId: document._id,
            userId: req.user._id
        });

        const quizCount = await Quiz.countDocuments({
            documentId: document._id,
            userId: req.user._id
        });

        document.lastAccessed = Date.now();
        await document.save();

        res.status(200).json({
            success: true,
            document,
            stats: {
                flashcards: flashcardCount,
                quizzes: quizCount
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update document
 * @route   PUT /api/documents/:id
 * @access  Private
 */
export const updateDocument = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid document ID",
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statusCode: 404
            });
        }

        const allowedUpdates = [
            "title"
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                document[field] = req.body[field];
            }
        });

        await document.save();

        res.status(200).json({
            success: true,
            message: "Document updated successfully",
            document
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete document
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
export const deleteDocument = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid document ID",
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found",
                statusCode: 404
            });
        }

        // Delete associated flashcards
        await FlashCard.deleteMany({
            documentId: document._id
        });

        await Quiz.deleteMany({
            documentId: document._id
        });

        // Delete physical file
        if (document.filePath) {
            await fs.unlink(document.filePath).catch(() => {});
        }

        // Delete document record
        await document.deleteOne();

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};