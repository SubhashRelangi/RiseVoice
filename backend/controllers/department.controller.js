import Department from '../models/Department.model.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';

export const signupDepartment = async (req, res) => {
  const { email, password, departmentType, departmentName, location } = req.body;
  const ipAddress = req.ip;

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

    const verificationCode = newDepartment.generateVerificationCode();

    await newDepartment.save();

    // Send verification email using the new sendEmail utility
    const htmlContent = `<p>Your verification code is: <b>${verificationCode}</b></p><p>This code will expire in 15 minutes.</p>`;
    await sendEmail(email, 'Verify Your Email', htmlContent);

    res.status(201).json({ message: 'Signup successful, please verify your email.' });
  } catch (error) {
    console.error('Signup error:', error);
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

    if (department.verificationExpiry < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired.' });
    }

    department.status = 'active';
    department.verificationCode = undefined; // Clear code after successful verification
    department.verificationExpiry = undefined; // Clear expiry
    await department.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginDepartment = async (req, res) => {
  const { departmentId, password } = req.body;
  const clientIpAddress = req.ip;

  try {
    const department = await Department.findOne({ departmentId });

    if (!department) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (department.status !== 'active') {
      return res.status(403).json({ message: 'Account not active. Please verify your email.' });
    }

    const isMatch = await department.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if req.ip matches stored ipAddress
    if (department.ipAddress && department.ipAddress !== clientIpAddress) {
      return res.status(403).json({ message: 'Unauthorized IP address.' });
    }

    department.lastLogin = Date.now();
    await department.save();

    // Generate JWT token
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

    // Generate new verification code and expiry
    const newVerificationCode = department.generateVerificationCode();
    await department.save();

    // Send new verification email
    const htmlContent = `<p>Your new verification code is: <b>${newVerificationCode}</b></p><p>This code will expire in 15 minutes.</p>`;
    await sendEmail(email, 'New Verification Code', htmlContent);

    res.status(200).json({ message: 'New verification code sent successfully.' });
  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};