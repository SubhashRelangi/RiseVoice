
import Department from '../models/Department.model.js';

export const registerDepartment = async (req, res) => {
  const { email, password, departmentType } = req.body;
  const ipAddress = req.ip;

  try {
    const existingDepartment = await Department.findOne({ email });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department with this email already exists.' });
    }

    const newDepartment = new Department({
      email,
      password,
      departmentType,
      ipAddress,
    });

    await newDepartment.save();

    res.status(201).json({ message: 'Department registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginDepartment = async (req, res) => {
  const { email, password } = req.body;

  try {
    const department = await Department.findOne({ email });
    if (!department) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await department.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    department.lastLogin = Date.now();
    await department.save();

    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
