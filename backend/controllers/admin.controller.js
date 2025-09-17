import Department from '../models/Department.model.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/email.js';

export const getDepartmentStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const totalCounts = await Department.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentCounts = await Department.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const previousCounts = await Department.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const formatCounts = (counts) => {
      const obj = { active: 0, pending: 0, rejected: 0 };
      counts.forEach(stat => {
        if (stat._id === 'approved') obj.active = stat.count;
        else if (stat._id === 'pending') obj.pending = stat.count;
        else if (stat._id === 'rejected') obj.rejected = stat.count;
      });
      return obj;
    };

    const totals = formatCounts(totalCounts);
    const recents = formatCounts(recentCounts);
    const previous = formatCounts(previousCounts);

    const calculatePercentageChange = (current, prev) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return ((current - prev) / prev) * 100;
    };

    const stats = {
      active: {
        count: totals.active,
        percentage: calculatePercentageChange(recents.active, previous.active)
      },
      pending: {
        count: totals.pending,
        percentage: calculatePercentageChange(recents.pending, previous.pending)
      },
      rejected: {
        count: totals.rejected,
        percentage: calculatePercentageChange(recents.rejected, previous.rejected)
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get department stats', error: error.message });
  }
};

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