import mongoose from 'mongoose';

const TrustedDeviceSchema = new mongoose.Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true // For efficient lookup
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department', // Assuming your Department model is named 'Department'
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsedAt: {
        type: Date,
        default: Date.now
    },
    revoked: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('TrustedDevice', TrustedDeviceSchema);
