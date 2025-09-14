import Admin from '../models/Admin.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Import crypto
import { sendAdminLoginOTP } from '../utils/email.js'; // Import new email function

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate and send OTP
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    admin.verificationCode = verificationCode;
    admin.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    await sendAdminLoginOTP(admin.email, verificationCode);

    res.status(200).json({ message: 'OTP sent to your email. Please verify to complete login.', requiresOTP: true, email: admin.email });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyAdminLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found.' });
    }

    if (admin.verificationCode !== otp) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (admin.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired.' });
    }

    // OTP is correct, proceed with login
    admin.verificationCode = undefined;
    admin.verificationCodeExpires = undefined;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Admin token expires in 1 hour
    );

    res.cookie('adminJwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 // 1 hour
    });

    res.status(200).json({ message: 'Admin login successful.', admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    console.error('Admin OTP verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const adminLogout = (req, res) => {
  res.cookie('adminJwtToken', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  res.status(200).json({ message: 'Admin logout successful.' });
};

export const checkAdminAuth = (req, res) => {
  const token = req.cookies.adminJwtToken;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assuming the token contains admin ID and role
    if (decoded.role === 'admin') {
      res.status(200).json({ isAuthenticated: true, admin: { id: decoded.id, role: decoded.role } });
    } else {
      res.status(403).json({ message: 'Not an admin.' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};