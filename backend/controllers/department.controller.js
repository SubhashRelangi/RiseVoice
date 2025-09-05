import Department from '../models/Department.model.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/email.js';
import crypto from 'crypto';

export const signupDepartment = async (req, res) => {
  const { email, password, departmentType, departmentName, location } = req.body;
  const forwardedIpsStr = req.header('x-forwarded-for');
  const ipAddress = forwardedIpsStr ? forwardedIpsStr.split(',')[0].trim() : req.ip;

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
      ipAddress,
      location,
    });

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    newDepartment.verificationCode = verificationCode;
    newDepartment.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await newDepartment.save();

    await sendVerificationEmail(email, verificationCode);

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

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginDepartment = async (req, res) => {
  const { departmentId, password } = req.body;
  const forwardedIpsStr = req.header('x-forwarded-for');
  const clientIpAddress = forwardedIpsStr ? forwardedIpsStr.split(',')[0].trim() : req.ip;

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

    if (department.ipAddress && department.ipAddress !== clientIpAddress) {
      return res.status(403).json({ message: 'Unauthorized IP address.' });
    }

    department.lastLogin = Date.now();
    await department.save();

    const token = jwt.sign(
      { id: department._id, email: department.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
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

        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: 'New verification code sent successfully.' });
    } catch (error) {
        console.error('Resend verification code error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};