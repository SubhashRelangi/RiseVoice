
import express from 'express';
import { registerDepartment, loginDepartment } from '../controllers/department.controller.js';

const router = express.Router();

router.post('/register', registerDepartment);
router.post('/login', loginDepartment);

export default router;
