import express from 'express';

import {
    getFlashcards,
    getAllFlashcards,
    reviewFlashcards,
    toggleStarFlashcards,
    deleteFlashcardSet,
} from '../controller/flashcardController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllFlashcards);

router.put('/:cardId/review', reviewFlashcards);

router.put('/:cardId/star', toggleStarFlashcards);

router.get('/:documentId', getFlashcards);

router.delete('/:id', deleteFlashcardSet);

export default router;