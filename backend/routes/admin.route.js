import express from 'express';
import { getPendingDepartments, approveDepartment, rejectDepartment, getDepartmentStats, getAllDepartments, getDepartmentById, removeDepartment, lockDepartment, unlockDepartment } from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/stats', isAdmin, getDepartmentStats);
router.get('/all-departments', isAdmin, getAllDepartments);
router.get('/department/:id', isAdmin, getDepartmentById);
router.get('/departments', isAdmin, getPendingDepartments);
router.put('/department/:id/approve', isAdmin, approveDepartment);
router.put('/department/:id/reject', isAdmin, rejectDepartment);
router.delete('/department/:id', isAdmin, removeDepartment);
router.put('/department/:id/lock', isAdmin, lockDepartment);
router.put('/department/:id/unlock', isAdmin, unlockDepartment);

export default router;