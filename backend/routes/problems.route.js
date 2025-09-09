import express from 'express';
import {
  createProblem,
  getProblems,
  getProblemById,
  deleteProblem,
  addComment,
  likeProblem,
  getProblemStats,
  getProblemCoordinates,
  updateProblemStatus,
} from '../controllers/problem.controller.js';

const router = express.Router();

// GET problem statistics
router.get('/stats', getProblemStats);

// GET all problem coordinates
router.get('/coordinates', getProblemCoordinates);

// POST a new problem
router.post('/', createProblem);

// GET all problems
router.get('/', getProblems);

// GET a single problem by ID
router.get('/:id', getProblemById);

// DELETE a problem by ID
router.delete('/:id', deleteProblem);

// POST a comment to a problem
router.post('/:id/comments', addComment);

// POST to like a problem
router.post('/:id/like', likeProblem);

// PUT to update problem status
router.put('/:id/status', updateProblemStatus);

export default router;
