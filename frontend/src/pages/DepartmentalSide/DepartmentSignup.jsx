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
    ipAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Get location & IP on load
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

    axios
      .get("https://api.ipify.org?format=json")
      .then((res) => {
        setFormData((prev) => ({ ...prev, ipAddress: res.data.ip }));
      })
      .catch((err) => {
        console.error("IP fetch error:", err);
        setErrors((prev) => ({
          ...prev,
          ipAddress: "Unable to fetch IP address",
        }));
      });
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

    if (!formData.ipAddress)
      newErrors.ipAddress = "IP Address is required.";

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

    setIsSubmitting(true);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      const res = await axios.post(`${API_BASE_URL}/api/departments/signup`, formData);

      setMessage(res.data.message || "Signup successful!");
      setTimeout(() => navigate(`/departmentverify?email=${formData.email}`), 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Location & IP */}
        <div className={styles.location}>
          <strong>Location:</strong>{" "}
          {formData.location.latitude && formData.location.longitude
            ? `${formData.location.latitude.toFixed(5)}, ${formData.location.longitude.toFixed(5)}`
            : "Detecting..."}
          {errors.location && <p className={styles.error}>{errors.location}</p>}
        </div>

        <div className={styles.location}>
          <strong>IP:</strong> {formData.ipAddress || "Detecting..."}
          {errors.ipAddress && <p className={styles.error}>{errors.ipAddress}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing Up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default DepartmentSignup;
