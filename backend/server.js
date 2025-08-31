import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import problemRoutes from './routes/problems.route.js';
import multer from 'multer';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multer for handling multipart/form-data
const upload = multer();
app.use(upload.any()); // Use upload.any() to parse all fields, including files and text

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use('/api/problems', problemRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
