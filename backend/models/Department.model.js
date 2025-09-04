import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const departmentCodeMap = {
  water: 'WT',
  electricity: 'EL',
  roads_infrastructure: 'RI',
  waste_management: 'WM',
  healthcare: 'HC',
  education: 'ED',
  transport: 'TR',
  agriculture: 'AG',
  revenue: 'RV',
  police: 'PL',
};

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },
  departmentType: {
    type: String,
    required: true,
    enum: ['WATER', 'ELECTRICITY', 'ROADS_INFRASTRUCTURE', 'WASTE_MANAGEMENT', 'HEALTHCARE', 'EDUCATION'],
  },
  departmentId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  lastLogin: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'locked'],
    default: 'pending',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verificationCode: {
    type: String,
  },
  verificationExpiry: {
    type: Date,
  },
}, { timestamps: true });

// Pre-save hook for generating departmentId and hashing password
departmentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const code = departmentCodeMap[this.departmentType.toLowerCase()]; // Use toLowerCase for map lookup
    this.departmentId = `DPT-${code}-${uuidv4().slice(0, 6)}`;
  }

  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Method to validate password
departmentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate verification code
departmentSchema.methods.generateVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = code;
  this.verificationExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  return code;
};

const Department = mongoose.model('Department', departmentSchema);

export default Department;