import Problem from '../models/Problem.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Public
export const createProblem = async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;

    let imageUrl = {};
    if (image) {
      const result = await cloudinary.uploader.upload(image.url, {
        folder: 'voiceup',
      });
      imageUrl = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const newProblem = new Problem({
      title,
      description,
      category,
      location,
      image: imageUrl,
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get a single problem by ID
// @route   GET /api/problems/:id
// @access  Public
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Delete a problem by ID
// @route   DELETE /api/problems/:id
// @access  Public
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ problemId: req.params.id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
