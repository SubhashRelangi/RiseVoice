import jwt from 'jsonwebtoken';
import Department from '../models/Department.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.jwtToken) {
    try {
      // Get token from cookie
      token = req.cookies.jwtToken;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get department from the token
      req.department = await Department.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
