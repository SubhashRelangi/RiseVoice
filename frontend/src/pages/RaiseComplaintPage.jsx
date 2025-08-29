import React, { useState } from "react";
import axios from "axios";
import styles from "./RaiseComplaintPage.module.css";
import CameraModal from "../Components/CameraModal"; // Import the modal

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

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0 // Don't use cached positions
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy; // Accuracy in meters

        if (accuracy > 20) { // If accuracy is worse than 20 meters
            alert(`Location accuracy is ${accuracy.toFixed(2)} meters. This might not be exact. Consider manually adjusting the address or coordinates.`);
        }

        try {
          // Using a free reverse geocoding service
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            lat,
            lng,
            address: data.display_name || "Address not found",
          }));
        } catch (err) {
          console.error("Failed to fetch address", err);
          // Still set lat/lng even if address fetch fails
          setFormData((prev) => ({ ...prev, lat, lng, address: "Could not fetch address" }));
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        let errorMessage = "Location access was denied. Please enter your address manually.";
        if (err.code === err.TIMEOUT) {
            errorMessage = "Could not get your location within the allowed time. Please try again or enter manually.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMessage = "Location information is unavailable. Please try again or enter manually.";
        }
        alert(errorMessage);
      },
      options // Pass the options object here
    );
  };

  const handleCapture = (imageBlob) => {
    const imageFile = new File([imageBlob], "capture.jpg", { type: "image/jpeg" });
    setFormData((prev) => ({ ...prev, image: imageFile }));
    setPreviewSrc(URL.createObjectURL(imageBlob));
    // Removed handleAutoLocation() from here. It will be triggered by a separate button.
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
        alert("Please take a picture for the complaint.");
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
          <button type="button" onClick={() => setIsCameraOpen(true)} className={styles.takePictureBtn}>
            📸 Take Picture
          </button>
          {previewSrc && (
            <div className={styles.previewContainer}>
              <h4>Preview:</h4>
              <img src={previewSrc} alt="Complaint preview" className={styles.previewImage} />
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
          placeholder="Enter address or use current location"n          value={formData.address}
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
          <button type="button" onClick={handleAutoLocation} className={styles.useLocationBtn}>
            📍 Use Current Location
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
