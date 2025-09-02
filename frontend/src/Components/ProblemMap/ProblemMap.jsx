import React, { useState, useEffect } from 'react';
import styles from './ProblemMap.module.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

// Fix for default icon not appearing
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ProblemMap = () => {
  const [problems, setProblems] = useState([]);
  const kakinadaPosition = [16.989065, 82.247467]; // Kakinada coordinates

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems/coordinates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Could not fetch problems:", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.title}>Community Concerns Map</h2>
      <MapContainer center={kakinadaPosition} zoom={13} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {problems.map(problem => (
          problem.location && problem.location.coordinates && problem.location.coordinates.lat && problem.location.coordinates.lng && (
            <Marker
              key={problem._id}
              position={[problem.location.coordinates.lat, problem.location.coordinates.lng]}
            >
              <Popup>
                <b>{problem.title}</b><br />
                Category: {problem.category}<br />
                Status: {problem.status}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default ProblemMap;
