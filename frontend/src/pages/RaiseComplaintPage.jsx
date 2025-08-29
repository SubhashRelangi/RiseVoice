import React, { useState } from "react";
import axios from "axios";
import styles from "./RaiseComplaintPage.module.css"; 

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Auto-detect user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          alert("Location access denied. Please enter manually.");
          console.error(err);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axios.post("http://localhost:5000/api/problems", data);
      alert("Complaint raised successfully!");
      setFormData(initialFormData); 
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      console.error(error);
      alert("Failed to raise complaint.");
    }
  };

  return (
    <div className={styles.complaintContainer}>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className={styles.complaintForm}
      >
        <h2>Raise a Complaint</h2>

        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />

        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
          <option value="Waste">Waste</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>

        {/* Manual Location Input */}
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <div className={styles.locationRow}>
          <input type="number" name="lat" placeholder="Latitude" value={formData.lat} onChange={handleChange} />
          <input type="number" name="lng" placeholder="Longitude" value={formData.lng} onChange={handleChange} />
          <button type="button" className={styles.locationBtn} onClick={handleGetLocation}>
            📍 Use My Location
          </button>
        </div>

        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        <button type="submit" className={styles.submitBtn}>Submit Complaint</button>
      </form>
    </div>
  );
};

export default RaiseComplaint;
