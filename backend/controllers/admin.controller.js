import Department from '../models/Department.model.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/email.js';
import axios from 'axios';

/** Remove department by ID */
export const removeDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Lock department (status → locked) */
export const lockDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    department.status = 'locked';
    await department.save();
    res.status(200).json({ message: 'Department locked successfully', department });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Unlock department (status → approved) */
export const unlockDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    department.status = 'approved';
    await department.save();
    res.status(200).json({ message: 'Department unlocked successfully', department });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Get single department + reverse geocode */
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).lean();
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // reverse geocoding if location exists
    if (department.location?.latitude && department.location?.longitude) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${department.location.latitude}&lon=${department.location.longitude}`
        );
        department.address = response.data.address;
      } catch (err) {
        console.error('Reverse geocoding error:', err.message);
        department.address = {
          road: 'N/A',
          city: 'N/A',
          state: 'N/A',
          postcode: 'N/A',
          country: 'N/A',
        };
      }
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Get all departments + their address fields */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}).lean();
    const departmentsWithAddress = await Promise.all(
      departments.map(async (dept) => {
        if (dept.location?.latitude && dept.location?.longitude) {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${dept.location.latitude}&lon=${dept.location.longitude}`
            );
            const address = response.data.address || {};
            return {
              ...dept,
              state: address.state,
              district: address.county || address.city_district || address.suburb,
              city: address.city || address.town || address.village,
            };
          } catch (err) {
            console.error('Reverse geocoding error:', err.message);
          }
        }
        return { ...dept, state: 'N/A', district: 'N/A', city: 'N/A' };
      })
    );
    res.status(200).json(departmentsWithAddress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Dashboard stats for active/pending/rejected */
export const getDepartmentStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const totalCounts = await Department.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const recentCounts = await Department.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const previousCounts = await Department.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const formatCounts = (counts) => {
      const obj = { active: 0, pending: 0, rejected: 0 };
      counts.forEach((stat) => {
        if (stat._id === 'approved') obj.active = stat.count;
        else if (stat._id === 'pending') obj.pending = stat.count;
        else if (stat._id === 'rejected') obj.rejected = stat.count;
      });
      return obj;
    };

    const totals = formatCounts(totalCounts);
    const recents = formatCounts(recentCounts);
    const previous = formatCounts(previousCounts);

    const calcPercent = (cur, prev) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return ((cur - prev) / prev) * 100;
    };

    const stats = {
      active: {
        count: totals.active,
        percentage: calcPercent(recents.active, previous.active),
      },
      pending: {
        count: totals.pending,
        percentage: calcPercent(recents.pending, previous.pending),
      },
      rejected: {
        count: totals.rejected,
        percentage: calcPercent(recents.rejected, previous.rejected),
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to get department stats', error: error.message });
  }
};

/** Only pending departments */
export const getPendingDepartments = async (req, res) => {
  try {
    const pendingDepartments = await Department.find({ status: 'pending' });
    res.status(200).json(pendingDepartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Approve department */
export const approveDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    if (department.status === 'rejected') {
      return res
        .status(400)
        .json({ message: 'This department has been rejected and cannot be approved.' });
    }
    department.status = 'approved';
    await department.save();
    await sendApprovalEmail(department.email, department.departmentName);
    res.status(200).json({ message: 'Department approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/** Reject department */
export const rejectDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    if (department.status === 'rejected') {
      return res
        .status(400)
        .json({ message: 'This department has already been rejected.' });
    }
    department.status = 'rejected';
    await department.save();
    await sendRejectionEmail(department.email, department.departmentName);
    res.status(200).json({ message: 'Department rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
