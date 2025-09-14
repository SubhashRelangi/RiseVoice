import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';

export const isAdmin = async (req, res, next) => {
  let token;

  if (req.cookies.adminJwtToken) { // Changed from jwtToken
    token = req.cookies.adminJwtToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized, not an admin' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};