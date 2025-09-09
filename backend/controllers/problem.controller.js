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
        comments: [],
        likes: 0,
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
    const { search, status, radius, departmentLat, departmentLng, category } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { problemId: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'Resolved') {
        filter.$or = [{ status: 'Resolved' }, { status: 'Resloved' }];
      } else {
        filter.status = status;
      }
    }

    if (category) {
      filter.category = category;
    }

    let problems = await Problem.find(filter);

    // Haversine formula for distance calculation (same as frontend)
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of Earth in kilometers

      const toRad = (Value) => (Value * Math.PI) / 180;

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // Distance in kilometers
      return distance;
    };

    if (radius && departmentLat && departmentLng) {
      const deptLat = parseFloat(departmentLat);
      const deptLng = parseFloat(departmentLng);
      const maxDistance = parseFloat(radius);

      problems = problems.filter(problem => {
        if (problem.location && problem.location.coordinates) {
          const complaintLat = problem.location.coordinates.lat;
          const complaintLng = problem.location.coordinates.lng;
          const dist = haversineDistance(deptLat, deptLng, complaintLat, complaintLng);
          return dist <= maxDistance;
        }
        return false;
      });
    }

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

    // Ensure likes and comments are not undefined
    if (problem.likes === undefined) {
      problem.likes = 0;
    }
    if (!problem.comments) {
      problem.comments = [];
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

// @desc    Add a comment to a problem
// @route   POST /api/problems/:id/comments
// @access  Public
export const addComment = async (req, res) => {
  try {
    console.log('Received comment data:', req.body); // Log the request body
    const { text } = req.body;
    const problem = await Problem.findOne({ problemId: req.params.id });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const newComment = {
      text,
    };

    if (!problem.comments) {
      problem.comments = [];
    }

    problem.comments.push(newComment);
    await problem.save();

    res.status(201).json(problem);
  } catch (error) {
    console.error('Error adding comment:', error); // Log the full error object
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Like a problem
// @route   POST /api/problems/:id/like
// @access  Public
export const getProblemStats = async (req, res) => {
  try {
    const stats = await Problem.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.status(200).json({
      resolved: statsMap['Resolved'] || 0,
      inProgress: statsMap['In Progress'] || 0,
      pending: statsMap['Pending'] || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const likeProblem = async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.id });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (problem.likes === undefined) {
      problem.likes = 1;
    } else {
      problem.likes += 1;
    }

    await problem.save();

    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get all problem coordinates
// @route   GET /api/problems/coordinates
// @access  Public
export const getProblemCoordinates = async (req, res) => {
  try {
    const problems = await Problem.find({}, 'title category status location.coordinates');
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
