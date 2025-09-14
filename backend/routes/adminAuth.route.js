import express from 'express';
import { adminLogin, adminLogout, verifyAdminLoginOTP, checkAdminAuth } from '../controllers/adminAuth.controller.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/verify-otp', verifyAdminLoginOTP);
router.post('/logout', adminLogout);
router.get('/check', checkAdminAuth); // New route

export default router;