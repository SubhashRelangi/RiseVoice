import express from 'express';
import {
  addComment,
  getCommentsByProblemId,
  likeComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

// POST a new comment
router.post('/', addComment);

// GET comments for a specific problem
router.get('/:problemId', getCommentsByProblemId);

// POST to like a comment
router.post('/:commentId/like', likeComment);

export default router;
