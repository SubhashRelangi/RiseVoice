import Department from '../models/Department.model.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/email.js';
import crypto from 'crypto';

export const signupDepartment = async (req, res) => {
  const { email, password, departmentType, departmentName, location } = req.body;

  try {
    const existingDepartment = await Department.findOne({ email });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department with this email already exists.' });
    }

    const newDepartment = new Department({
      email,
      password,
      departmentType,
      departmentName,
      location,
    });

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    newDepartment.verificationCode = verificationCode;
    newDepartment.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await newDepartment.save();

    await sendVerificationEmail(email, verificationCode, newDepartment.departmentId, newDepartment.departmentName);

    res.status(201).json({ message: 'Signup successful, please verify your email.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const sendVerification = async (req, res) => {
    const { email } = req.body;
    try {
        const department = await Department.findOne({ email });
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        department.verificationCode = verificationCode;
        department.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await department.save();

        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: 'Verification code sent to department email.' });
    } catch (error) {
        console.error('Send verification email error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const department = await Department.findOne({ email });

    if (!department) {
      return res.status(400).json({ message: 'Department not found.' });
    }

    if (department.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (department.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired.' });
    }

    department.isVerified = true;
    department.status = 'active';
    department.verificationCode = undefined;
    department.verificationCodeExpires = undefined;
    await department.save();

    const token = jwt.sign(
      { id: department._id, email: department.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 12 // 12 hours
    });

    res.status(200).json({
        message: 'Email verified successfully',
        departmentId: department.departmentId,
        departmentName: department.departmentName,
        departmentType: department.departmentType,
        location: department.location,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginDepartment = async (req, res) => {
  const { departmentId, password } = req.body;

  try {
    const department = await Department.findOne({ departmentId });

    if (!department) {
      return res.status(400).json({ message: 'Invalid Department ID or Password.' });
    }

    if (!department.isVerified) {
        return res.status(403).json({ message: 'Account not verified. Please verify your email.' });
    }

    if (department.status !== 'active') {
      return res.status(403).json({ message: 'Account not active.' });
    }

    const isMatch = await department.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Department ID or Password.' });
    }

    department.lastLogin = Date.now();
    await department.save();

    const token = jwt.sign(
      { id: department._id, email: department.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 12 // 12 hours
    });

    res.status(200).json({
      message: 'Login successful.',
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      departmentType: department.departmentType,
      location: department.location,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const department = await Department.findOne({ email });
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        department.verificationCode = verificationCode;
        department.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await department.save();

        await sendVerificationEmail(email, verificationCode, department.departmentId, department.departmentName);

        res.status(200).json({ message: 'New verification code sent successfully.' });
    } catch (error) {
        console.error('Resend verification code error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logoutDepartment = (req, res) => {
    res.cookie('jwtToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.status(200).json({ message: 'Logout successful.' });
};

export const getDepartmentProfile = (req, res) => {
  // The 'protect' middleware already attached the department to req.department
  if (req.department) {
    res.status(200).json({
      name: req.department.departmentName,
      serviceType: req.department.departmentType, // Assuming departmentType maps to serviceType
      isActive: req.department.status === 'active', // Assuming status field exists
      isVerified: req.department.isVerified,
      // Add any other fields you want to expose to the frontend
    });
  } else {
    res.status(404).json({ message: 'Department profile not found.' });
  }
};

export const checkAuth = (req, res) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assuming the token contains department ID and email
    res.status(200).json({ isAuthenticated: true, department: { id: decoded.id, email: decoded.email } });
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};