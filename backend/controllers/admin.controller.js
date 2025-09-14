import Department from '../models/Department.model.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/email.js';

export const getPendingDepartments = async (req, res) => {
  try {
    const pendingDepartments = await Department.find({ status: 'verified' });
    res.status(200).json(pendingDepartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const approveDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({ departmentId: req.params.id });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (department.status === 'rejected') {
      return res.status(400).json({ message: 'This department has been rejected and cannot be approved.' });
    }

    department.status = 'approved';
    await department.save();

    await sendApprovalEmail(department.email, department.departmentName);

    res.status(200).json({ message: 'Department approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rejectDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({ departmentId: req.params.id });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (department.status === 'rejected') {
      return res.status(400).json({ message: 'This department has already been rejected.' });
    }

    department.status = 'rejected';
    await department.save();

    await sendRejectionEmail(department.email, department.departmentName);

    res.status(200).json({ message: 'Department rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};