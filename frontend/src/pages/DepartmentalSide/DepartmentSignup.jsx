import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./DepartmentSignup.module.css";

const DepartmentSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentType: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: { latitude: null, longitude: null },
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const departmentTypes = [
    "WATER",
    "ELECTRICITY",
    "ROADS_INFRASTRUCTURE",
    "WASTE_MANAGEMENT",
    "HEALTHCARE",
    "EDUCATION",
    "TRANSPORT",
    "AGRICULTURE",
    "REVENUE",
    "POLICE",
  ];

  // Get location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
          }));
        },
        (err) => {
          console.error("Geolocation error:", err);
          setErrors((prev) => ({
            ...prev,
            location: "Unable to get location. Allow location access.",
          }));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate before submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.departmentName.trim())
      newErrors.departmentName = "Department Name is required.";

    if (!formData.email)
      newErrors.email = "Email is required.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formData.email))
      newErrors.email = "Invalid email format.";

    if (!formData.password)
      newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = "Must contain at least one uppercase letter.";
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = "Must contain at least one number.";
    else if (!/[^A-Za-z0-9]/.test(formData.password))
      newErrors.password = "Must contain at least one special character.";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";

    if (!formData.location.latitude || !formData.location.longitude)
      newErrors.location = "Location is required.";

    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSigningUp(true);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      const res = await axios.post(`${API_BASE_URL}/api/departments/signup`, formData);

      setMessage(res.data.message || "Signup successful! Please check your email for the verification code.");
      setShowVerification(true);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsVerifying(true);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      const res = await axios.post(`${API_BASE_URL}/api/departments/verify-email`, {
        email: formData.email,
        verificationCode,
      });
      setMessage(res.data.message || "Verification successful! You will be redirected to login.");
      setVerificationCode('');
      setTimeout(() => navigate("/department/login"), 2000);
    } catch (err) {
      console.error("Verification error:", err);
      setMessage(err.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setMessage("");
    setIsResending(true);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      await axios.post(`${API_BASE_URL}/api/departments/resend-verification`, { email: formData.email });
      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Resend code error:", err);
      setMessage(err.response?.data?.message || "Failed to resend code. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (showVerification) {
    return (
      <div className={styles.page}>
        <form onSubmit={handleVerifySubmit} className={styles.signupForm}>
          <h2 className={styles.title}>Verify Your Email</h2>
          {message && (
            <div
              className={`${styles.message} ${
                message.toLowerCase().includes("success") || message.toLowerCase().includes("sent")
                  ? styles.success
                  : styles.error
              }`}
            >
              {message}
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Verification Code</label>
            <input
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={isVerifying || isResending}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={handleResendCode}
            className={`${styles.button} ${styles.resendButton}`}
            disabled={isVerifying || isResending}
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <h2 className={styles.title}>Department Signup</h2>

        {message && (
          <div
            className={`${styles.message} ${
              message.toLowerCase().includes("success")
                ? styles.success
                : styles.error
            }`}
          >
            {message}
          </div>
        )}

        {/* Department Name */}
        <div className={styles.field}>
          <label className={styles.label}>Department Name *</label>
          <input
            type="text"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.departmentName && (
            <span className={styles.error}>{errors.departmentName}</span>
          )}
        </div>

        {/* Department Type */}
        <div className={styles.field}>
          <label className={styles.label}>Department Type *</label>
          <select
            name="departmentType"
            value={formData.departmentType}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Select Type</option>
            {departmentTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label className={styles.label}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div className={styles.field}>
          <label className={styles.label}>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className={styles.field}>
          <label className={styles.label}>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>

        {/* Location */}
        <div className={styles.location}>
          <strong>Location:</strong>{" "}
          {formData.location.latitude && formData.location.longitude
            ? `${formData.location.latitude.toFixed(5)}, ${formData.location.longitude.toFixed(5)}`
            : "Detecting..."}
          {errors.location && <p className={styles.error}>{errors.location}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={styles.button}
          disabled={isSigningUp}
        >
          {isSigningUp ? "Signing Up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default DepartmentSignup;