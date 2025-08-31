import Comment from '../models/Comment.model.js';
import Problem from '../models/Problem.model.js';

// @desc    Add a new comment to a problem
// @route   POST /api/comments
// @access  Public
export const addComment = async (req, res) => {
  try {
    const { problemId, text } = req.body;

    // Basic validation
    if (!problemId || !text) {
      return res.status(400).json({ message: 'Problem ID and text are required' });
    }

    // Check if the problem exists
    const problemExists = await Problem.findOne({ problemId: problemId });
    if (!problemExists) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const newComment = new Comment({
      problemId,
      text,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get comments for a specific problem
// @route   GET /api/comments/:problemId
// @access  Public
export const getCommentsByProblemId = async (req, res) => {
  try {
    const { problemId } = req.params;

    const comments = await Comment.find({ problemId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Increment likes for a comment
// @route   POST /api/comments/:commentId/like
// @access  Public
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes += 1;
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
