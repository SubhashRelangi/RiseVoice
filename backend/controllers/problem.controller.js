import Problem from '../models/Problem.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Public
export const createProblem = async (req, res) => {
  try {
    const { title, description, category, address, lat, lng } = req.body; // Get text fields from req.body
    const imageFile = req.file; // Get the image file from req.file

    let imageUrl = {};
    if (imageFile) {
      // Convert buffer to data URI
      const dataUri = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
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
      location: {
        address,
        coordinates: { lat, lng },
      },
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
