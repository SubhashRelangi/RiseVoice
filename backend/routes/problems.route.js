import express from 'express';
import {
  createProblem,
  getProblems,
  getProblemById,
  deleteProblem,
  addComment,
  likeProblem,
} from '../controllers/problem.controller.js';

const router = express.Router();

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

export default router;
