import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import problemRoutes from './routes/problems.route.js';
import departmentRoutes from './routes/department.route.js';
import adminRoutes from './routes/admin.route.js';
import adminAuthRoutes from './routes/adminAuth.route.js';
import multer from 'multer';
import { startRequestScheduler } from './requestScheduler.js';
import Admin from './models/Admin.model.js'; // Import Admin model
import bcrypt from 'bcrypt'; // Import bcrypt

dotenv.config();

const app = express();
app.set('trust proxy', true);

// Middleware
app.use(cors({
  origin: [
    "https://risevoice.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Multer for handling multipart/form-data
const upload = multer();
app.use(upload.any()); // Use upload.any() to parse all fields, including files and text

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Temporary route to create an admin user (REMOVE IN PRODUCTION)
app.post('/api/create-admin', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin user created successfully.' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  startRequestScheduler();
});
