import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./DepartmentVerify.module.css";

const DepartmentVerify = ({ setIsLoggedIn }) => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: initialEmail,
    verificationCode: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = "Verification code is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsVerifying(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/departments/verify-email`, formData, { withCredentials: true });
      setMessage(res.data.message || "Verification successful!");

      localStorage.setItem('departmentDetails', JSON.stringify({
        departmentId: res.data.departmentId,
        departmentName: res.data.departmentName,
        departmentType: res.data.departmentType,
        location: res.data.location,
      }));

      setIsLoggedIn(true);
      setTimeout(() => navigate("/department"), 1500);
    } catch (error) {
      console.error("Verification error:", error);
      setMessage(error.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setMessage("");
    setErrors({});
    setIsResending(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/departments/resend-verification`, { email: formData.email });
      setMessage(res.data.message || "New verification code sent to your email.");
    } catch (error) {
      console.error("Resend code error:", error);
      setMessage(error.response?.data?.message || "Failed to resend code. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.card} noValidate>
        <h2 className={styles.title}>Verify Department</h2>

        {message && (
          <div
            className={
              /success|verified/i.test(message)
                ? styles.alertSuccess
                : styles.alertError
            }
          >
            {message}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Email *</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Verification Code *</label>
          <input
            type="text"
            name="verificationCode"
            className={styles.input}
            value={formData.verificationCode}
            onChange={handleChange}
            required
          />
          {errors.verificationCode && (
            <span className={styles.error}>{errors.verificationCode}</span>
          )}
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
          className={`${styles.button} ${styles.resendButton}`}
          onClick={handleResendCode}
          disabled={isVerifying || isResending}
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </form>
    </div>
  );
};

export default DepartmentVerify;
