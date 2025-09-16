import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./RaiseComplaintPage.module.css";
import CameraModal from "../../Components/RaiseComplaints/CameraModal";
import { FaCamera, FaImage, FaMapMarkerAlt } from "react-icons/fa";
import { FiX } from 'react-icons/fi'; // Import the close icon
import { useNavigate } from "react-router-dom";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  address: "",
  lat: "",
  lng: "",
  image: null,
};

const RaiseComplaint = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // ✅ Added to handle field errors
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // cleanup preview URLs
  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocationLoading(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          lat,
          lng,
        }));
        setIsLocationLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        let errorMessage =
          "Location access was denied. Please enter your address manually.";
        if (err.code === 3) {
          errorMessage =
            "Could not get your location within the allowed time. Please try again or enter manually.";
        }
        alert(errorMessage);
        setIsLocationLoading(false);
      },
      options
    );
  };

  const handleCapture = (blob) => {
    if (!blob || blob.size === 0) {
      alert(
        "Failed to capture image/video. Please ensure camera is active and try again."
      ); // ✅ replaced showNotification with alert
      setIsCameraOpen(false);
      return;
    }

    let file;
    if (blob.type.startsWith("video/")) {
      file = new File([blob], "capture.webm", { type: blob.type });
    } else {
      file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    }
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewSrc(URL.createObjectURL(blob));
    setErrors((prev) => ({ ...prev, image: undefined }));
    setIsCameraOpen(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewSrc(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please take a picture or select a file for the complaint.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") data.append(key, value);
    });

    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_BASE_URL}/api/problems`, data);

      alert("Complaint submitted successfully!");
      setFormData(initialFormData);
      setPreviewSrc(null);

      const newComplaintId = response.data.problemId;
      navigate(`/complaint/${newComplaintId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePreview = () => {
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc(null);
    setFormData((prev) => ({ ...prev, image: null }));
    setErrors((prev) => ({ ...prev, image: "Image is required." })); // Optionally add an error if image is mandatory
  };

  return (
    <div className={styles.complaintContainer}>
      <form onSubmit={handleSubmit} className={styles.complaintForm}>
        <h2>Raise a Complaint</h2>

        <div className={styles.captureSection}>
          <button
            type="button"
            onClick={() => {
              setIsCameraLoading(true);
              setTimeout(() => {
                setIsCameraOpen(true);
                setIsCameraLoading(false);
              }, 2000);
            }}
            className={
              isCameraLoading
                ? `${styles.takePictureBtn} ${styles.loading}`
                : styles.takePictureBtn
            }
            disabled={isCameraLoading}
          >
            {isCameraLoading ? (
              "Loading..."
            ) : (
              <>
                <FaCamera /> Take Picture or Video
              </>
            )}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />

          <button
            type="button"
            onClick={() => {
              setIsGalleryLoading(true);
              setTimeout(() => {
                fileInputRef.current.click();
                setIsGalleryLoading(false);
              }, 2000);
            }}
            className={
              isGalleryLoading
                ? `${styles.takePictureBtn} ${styles.loading}`
                : styles.takePictureBtn
            }
            disabled={isGalleryLoading}
          >
            {isGalleryLoading ? (
              "Loading..."
            ) : (
              <>
                <FaImage /> Choose from Gallery
              </>
            )}
          </button>

          {previewSrc && (
            <div className={styles.previewContainer}>
              <h4>Preview:</h4>
              {formData.image &&
              formData.image.type &&
              formData.image.type.startsWith("video") ? (
                <video
                  src={previewSrc}
                  className={styles.previewImage}
                  controls
                />
              ) : (
                <img
                  src={previewSrc}
                  alt="Complaint preview"
                  className={styles.previewImage}
                />
              )}
              <button type="button" onClick={handleRemovePreview} className={styles.removePreviewBtn}><FiX /></button>
            </div>
          )}
        </div>

        <input
          type="text"
          name="title"
          placeholder="Title of the issue"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe the issue in detail"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="WATER">Water</option>
          <option value="ELECTRICITY">Electricity</option>
          <option value="ROADS_INFRASTRUCTURE">Roads & Infrastructure</option>
          <option value="WASTE_MANAGEMENT">Waste Management</option>
          <option value="HEALTHCARE">Healthcare</option>
          <option value="EDUCATION">Education</option>
          <option value="TRANSPORT">Transport</option>
          <option value="AGRICULTURE">Agriculture</option>
          <option value="REVENUE">Revenue</option>
          <option value="POLICE">Police</option>
        </select>

        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div className={styles.locationRow}>
          <input
            type="text"
            name="lat"
            placeholder="Latitude"
            value={formData.lat}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lng"
            placeholder="Longitude"
            value={formData.lng}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={handleAutoLocation}
            className={
              isLocationLoading
                ? `${styles.useLocationBtn} ${styles.loading}`
                : styles.useLocationBtn
            }
            disabled={isLocationLoading}
          >
            {isLocationLoading ? (
              "Loading..."
            ) : (
              <>
                <FaMapMarkerAlt /> Use Current Location
              </>
            )}
          </button>
        </div>

        <button
          type="submit"
          className={
            isSubmitting
              ? `${styles.submitBtn} ${styles.loading}`
              : styles.submitBtn
          }
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
};

export default RaiseComplaint;
