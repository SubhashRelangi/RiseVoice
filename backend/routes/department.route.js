import express from 'express';
import { signupDepartment, sendVerification, verifyEmail, loginDepartment, resendVerificationCode } from '../controllers/department.controller.js';

const router = express.Router();

router.post('/signup', signupDepartment);
router.post('/send-verification', sendVerification);
router.post('/resend-verification', resendVerificationCode);
router.post('/verify-email', verifyEmail);
router.post('/login', loginDepartment);

export default router;