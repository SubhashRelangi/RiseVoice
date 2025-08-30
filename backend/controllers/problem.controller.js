import Problem from '../models/Problem.model.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Public
export const createProblem = (req, res) => {
  try {
    const { title, description, category, address, lat, lng } = req.body;
    const imageFile = req.files && req.files.length > 0 ? req.files[0] : undefined;

    if (!imageFile) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const resource_type = imageFile.mimetype.startsWith('video') ? 'video' : 'image';

    const options = {
      folder: 'voiceup',
      resource_type: resource_type,
    };

    if (resource_type === 'video') {
      options.format = 'mp4';
      options.video_codec = 'h264';
      options.audio_codec = 'aac';
      options.quality = 'auto:good';
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Server Error', error });
      }

      const imageUrl = {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: resource_type,
      };

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

      newProblem.save()
        .then(savedProblem => res.status(201).json(savedProblem))
        .catch(saveError => {
            console.error('DB save error:', saveError);
            res.status(500).json({ message: 'Server Error', error: saveError });
        });
    });

    Readable.from(imageFile.buffer).pipe(uploadStream);

  } catch (error) {
    console.error(error);
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
