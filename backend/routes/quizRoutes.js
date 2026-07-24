import express from 'express';

import {
    getQuizzes,
    getQuiz,
    submitQuiz,
    deleteQuiz,
    getQuizHistory
} from '../controller/quizController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Get all quizzes of current user
router.get('/', getQuizzes);

// Get quiz history/statistics
router.get('/history', getQuizHistory);

// Get a single quiz
router.get('/:quizId', getQuiz);

// Submit answers for a quiz
router.post('/:quizId/submit', submitQuiz);

// Delete quiz
router.delete('/:quizId', deleteQuiz);

export default router;