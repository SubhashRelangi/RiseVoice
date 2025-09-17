import express from 'express';
import { getPendingDepartments, approveDepartment, rejectDepartment, getDepartmentStats, getAllDepartments } from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/stats', isAdmin, getDepartmentStats);
router.get('/all-departments', isAdmin, getAllDepartments);
router.get('/departments', isAdmin, getPendingDepartments);
router.put('/department/:id/approve', isAdmin, approveDepartment);
router.put('/department/:id/reject', isAdmin, rejectDepartment);

export default router;