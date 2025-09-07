import express from 'express';
import { signupDepartment, sendVerification, verifyEmail, loginDepartment, resendVerificationCode, logoutDepartment, getDepartmentProfile, checkAuth } from '../controllers/department.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupDepartment);
router.post('/send-verification', sendVerification);
router.post('/resend-verification', resendVerificationCode);
router.post('/verify-email', verifyEmail);
router.post('/login', loginDepartment);
router.post('/logout', logoutDepartment);

router.get('/checkAuth', checkAuth);

router.get('/verify-token', protect, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});

router.get('/profile', protect, getDepartmentProfile);

export default router;