import TrustedDevice from '../models/TrustedDevice.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10; // For bcrypt hashing

const trustedDeviceService = {
    /**
     * Generates a new trusted device token, hashes it, and saves it to the database.
     * @param {string} departmentId - The ID of the department.
     * @param {string} userAgent - The user agent string of the device.
     * @param {string} ipAddress - The IP address of the device.
     * @returns {Promise<string>} The plain (unhashed) trusted device token.
     */
    async generateAndSaveTrustedDeviceToken(departmentId, userAgent, ipAddress) {
        const plainToken = crypto.randomBytes(32).toString('hex'); // Generate a random token
        const tokenHash = await bcrypt.hash(plainToken, SALT_ROUNDS);

        const newTrustedDevice = new TrustedDevice({
            tokenHash,
            department: departmentId,
            userAgent,
            ipAddress,
            createdAt: new Date(),
            lastUsedAt: new Date()
        });

        await newTrustedDevice.save();
        return plainToken;
    },

    /**
     * Validates an incoming plain trusted device token against the stored hashed version and metadata.
     * Updates the lastUsedAt timestamp if valid.
     * @param {string} plainToken - The plain (unhashed) trusted device token from the client.
     * @param {string} departmentId - The ID of the department.
     * @param {string} userAgent - The user agent string of the device.
     * @param {string} ipAddress - The IP address of the device.
     * @returns {Promise<boolean>} True if the token is valid and recognized, false otherwise.
     */
    async validateTrustedDeviceToken(plainToken, departmentId, userAgent, ipAddress) {
        if (!plainToken) return false;

        const trustedDevice = await TrustedDevice.findOne({ department: departmentId, revoked: false });

        if (!trustedDevice) {
            return false; // No trusted device found for this department or it's revoked
        }

        const isMatch = await bcrypt.compare(plainToken, trustedDevice.tokenHash);

        if (isMatch) {
            // Optionally, add more stringent checks here, e.g., IP address or user agent matching
            // For now, we'll allow a match if the token hash matches and it's for the correct department.
            // You might want to implement a more flexible matching strategy for userAgent/ipAddress
            // to account for minor variations or dynamic IPs.
            
            // Update lastUsedAt timestamp
            trustedDevice.lastUsedAt = new Date();
            await trustedDevice.save();
            return true;
        }

        return false;
    },

    /**
     * Revokes a specific trusted device token by its ID.
     * @param {string} tokenId - The ID of the trusted device document to revoke.
     * @returns {Promise<boolean>} True if revoked successfully, false otherwise.
     */
    async revokeTrustedDeviceToken(tokenId) {
        const result = await TrustedDevice.findByIdAndUpdate(tokenId, { revoked: true }, { new: true });
        return !!result;
    },

    /**
     * Revokes all trusted device tokens for a given department.
     * @param {string} departmentId - The ID of the department.
     * @returns {Promise<number>} The number of tokens revoked.
     */
    async revokeAllTrustedDevicesForDepartment(departmentId) {
        const result = await TrustedDevice.updateMany({ department: departmentId }, { revoked: true });
        return result.modifiedCount;
    },

    /**
     * Finds all trusted devices for a given department.
     * @param {string} departmentId - The ID of the department.
     * @returns {Promise<Array>}
     */
    async getTrustedDevicesForDepartment(departmentId) {
        return TrustedDevice.find({ department: departmentId });
    }
};

export default trustedDeviceService;
