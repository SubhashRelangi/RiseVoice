import express from 'express';
import { signupDepartment, verifyEmail, loginDepartment } from '../controllers/department.controller.js';

const router = express.Router();

router.post('/signup', signupDepartment);
router.post('/verify', verifyEmail);
router.post('/login', loginDepartment);

export default router;