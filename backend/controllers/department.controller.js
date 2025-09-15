import Department from '../models/Department.model.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPendingApprovalEmail } from '../utils/email.js';
import crypto from 'crypto';
import trustedDeviceService from '../services/trustedDeviceService.js';


export const signupDepartment = async (req, res) => {
  const { email, password, departmentType, departmentName, location } = req.body;

  try {

    const governmentDomains = [
      '.gov.in',
      '.nic.in',
      '.res.in',
      '.mil.in',
      '.edu.in', // For government educational institutions
    ];

    // Check if the email belongs to a government domain
    const isGovernmentEmail = governmentDomains.some(domain => email.toLowerCase().endsWith(domain));

    if (!isGovernmentEmail) {
      return res.status(400).json({ message: 'Only government emails are allowed for department signup.' });
    }

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
    department.status = 'verified';
    department.verificationCode = undefined;
    department.verificationCodeExpires = undefined;
    await department.save();

    await sendPendingApprovalEmail(department.email, department.departmentName, department.departmentId, department.location);

    res.status(200).json({
        message: 'email verification is completed not approved wait for it if approvial process is completed we send email',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginDepartment = async (req, res) => {
  const { departmentId, password } = req.body;
  const trustedDeviceToken = req.cookies.trustedDeviceToken; // Assuming cookie name

  try {
    const department = await Department.findOne({ departmentId });

    if (!department) {
      return res.status(400).json({ message: 'Invalid Department ID or Password.' });
    }

    if (!department.isVerified) {
        return res.status(403).json({ message: 'Account not verified. Please verify your email.' });
    }

    if (department.status === 'verified') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    if (department.status === 'rejected') {
      return res.status(403).json({ message: 'Your account has been rejected. Please contact support for more information.' });
    }

    if (department.status !== 'approved') {
      return res.status(403).json({ message: 'Account not active.' });
    }

    const isMatch = await department.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Department ID or Password.' });
    }

    // Password is correct, now check device trust
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip; // Ensure req.ip is correctly configured to get client IP

    const isTrustedDevice = await trustedDeviceService.validateTrustedDeviceToken(
      trustedDeviceToken,
      department._id, // Use department._id for trusted device service
      userAgent,
      ipAddress
    );

    if (isTrustedDevice) {
      // Device is trusted, proceed with normal login
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
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 12 // 12 hours
      });

      res.status(200).json({
        message: 'Login successful.',
        departmentId: department.departmentId,
        departmentName: department.departmentName,
        departmentType: department.departmentType,
        location: department.location,
      });
    } else {
      // Device is NOT trusted, trigger email verification
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      department.verificationCode = verificationCode;
      department.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await department.save();

      await sendVerificationEmail(department.email, verificationCode, department.departmentId, department.departmentName);

      res.status(401).json({
        message: 'Device not recognized. A verification code has been sent to your email. Please verify to continue login.',
        requiresOTP: true,
        departmentId: department.departmentId // Send departmentId back for OTP verification
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyLoginOTP = async (req, res) => {
  const { departmentId, otp } = req.body;

  try {
    const department = await Department.findOne({ departmentId });

    if (!department) {
      return res.status(400).json({ message: 'Department not found.' });
    }

    if (department.verificationCode !== otp) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (department.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired.' });
    }

    // OTP is correct, proceed with login and set trusted device token
    department.verificationCode = undefined;
    department.verificationCodeExpires = undefined;
    await department.save();

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const newTrustedDeviceToken = await trustedDeviceService.generateAndSaveTrustedDeviceToken(
      department._id,
      userAgent,
      ipAddress
    );

    res.cookie('trustedDeviceToken', newTrustedDeviceToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none', // Adjust as per your CORS/SameSite policy
      maxAge: 1000 * 60 * 60 * 24 * 90 // 3 months (approx. 90 days) for trusted device token
    });

    const token = jwt.sign(
      { id: department._id, email: department.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 12 // 12 hours
    });

    res.status(200).json({
      message: 'Login successful and device trusted.',
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      departmentType: department.departmentType,
      location: department.location,
    });

  } catch (error) {
    console.error('OTP verification error:', error);
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
        sameSite: 'none',
    });
    res.status(200).json({ message: 'Logout successful.' });
};

export const getDepartmentProfile = (req, res) => {
  // The 'protect' middleware already attached the department to req.department
  if (req.department) {
    res.status(200).json({
      name: req.department.departmentName,
      id: req.department.departmentId,
      email: req.department.email,
      serviceType: req.department.departmentType, // Assuming departmentType maps to serviceType
      location: req.department.location,
      isActive: req.department.status === 'approved', // Assuming status field exists
      isVerified: req.department.isVerified,
      lastLogin: req.department.lastLogin,
      createdAt: req.department.createdAt, // Add createdAt field
      updatedAt: req.department.updatedAt, // Add updatedAt field
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