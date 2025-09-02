import React, { useState, useRef } from "react";
import axios from "axios";
import styles from "./RaiseComplaintPage.module.css";
import CameraModal from "../../Components/RaiseComplaints/CameraModal"; // Import the modal
import { FaCamera, FaImage, FaMapMarkerAlt } from "react-icons/fa";

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
  const [isCameraOpen, setIsCameraOpen] = useState(false); // State to control modal
  const [isCameraLoading, setIsCameraLoading] = useState(false); // New loading state for camera
  const [isGalleryLoading, setIsGalleryLoading] = useState(false); // New loading state for gallery
  const [isLocationLoading, setIsLocationLoading] = useState(false); // New loading state for location
  const fileInputRef = useRef(null);

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0, // Don't use cached positions
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
      },
      (err) => {
        console.error("Geolocation error:", err);
        let errorMessage =
          "Location access was denied. Please enter your address manually.";
        if (err.code === err.TIMEOUT) {
          errorMessage =
            "Could not get your location within the allowed time. Please try again or enter manually.";
        }
        alert(errorMessage);
      },
      options // Pass the options object here
    );
  };

  const handleCapture = (blob) => {
    let file;
    if (blob.type.startsWith('video/')) {
      file = new File([blob], 'capture.webm', { type: blob.type });
    } else {
      file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
    }
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewSrc(URL.createObjectURL(blob));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewSrc(URL.createObjectURL(file));
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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axios.post("http://localhost:5000/api/problems", data);
      alert("Complaint submitted successfully!");
      // Reset form
      setFormData(initialFormData);
      setPreviewSrc(null);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit complaint. Please try again.");
    }
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
            className={isCameraLoading ? `${styles.takePictureBtn} ${styles.loading}` : styles.takePictureBtn}
            disabled={isCameraLoading}
          >
            {isCameraLoading ? "Loading..." : <><FaCamera /> Take Picture or Video</>}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
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
            className={isGalleryLoading ? `${styles.takePictureBtn} ${styles.loading}` : styles.takePictureBtn}
            disabled={isGalleryLoading}
          >
            {isGalleryLoading ? "Loading..." : <><FaImage /> Choose from Gallery</>}
          </button>
          {previewSrc && (
            <div className={styles.previewContainer}>
              <h4>Preview:</h4>
              {formData.image && formData.image.type.startsWith('video') ? (
                <video src={previewSrc} className={styles.previewImage} controls />
              ) : (
                <img src={previewSrc} alt="Complaint preview" className={styles.previewImage} />
              )}
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
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
          <option value="Waste">Waste</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
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
            type="number"
            name="lat"
            placeholder="Latitude"
            value={formData.lat}
            onChange={handleChange}
            step="any" // Allow decimal input
          />
          <input
            type="number"
            name="lng"
            placeholder="Longitude"
            value={formData.lng}
            onChange={handleChange}
            step="any" // Allow decimal input
          />
          <button
            type="button"
            onClick={() => {
              setIsLocationLoading(true);
              handleAutoLocation();
              setTimeout(() => {
                setIsLocationLoading(false);
              }, 2000);
            }}
            className={isLocationLoading ? `${styles.useLocationBtn} ${styles.loading}` : styles.useLocationBtn}
            disabled={isLocationLoading}
          >
            {isLocationLoading ? "Loading..." : <><FaMapMarkerAlt /> Use Current Location</>}
          </button>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Submit Complaint
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