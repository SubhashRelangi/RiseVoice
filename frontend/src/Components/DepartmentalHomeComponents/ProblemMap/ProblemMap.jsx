import React from 'react';
import styles from './ProblemMap.module.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

// Import Leaflet.awesome-markers CSS and JS
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';

// Fix for default icon not appearing
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Function to get awesome marker icon based on status
const getAwesomeMarkerIcon = (status) => {
  let markerColor = 'blue'; // Default color

  switch (status) {
    case 'Pending':
      markerColor = 'red';
      break;
    case 'In Progress':
      markerColor = 'orange';
      break;
    case 'Resolved':
    case 'Resloved':
      markerColor = 'green';
      break;
    case 'Rejected':
      markerColor = 'darkred';
      break;
    default:
      markerColor = 'blue'; // Fallback
  }

  return L.AwesomeMarkers.icon({
    icon: 'fa-location-dot',   // Modern location pin icon
    prefix: 'fa',              // Use FontAwesome
    markerColor: markerColor,  // Marker background color
    iconColor: 'white'         // Icon color inside the marker
  });
};

const ProblemMap = ({ problems, departmentLocation }) => {
  const mapCenter = departmentLocation
    ? [departmentLocation.latitude, departmentLocation.longitude]
    : [16.989065, 82.247467]; // Default to Kakinada if location not available

  if (!departmentLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.title}>Community Concerns Map</h2>
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {problems.map(problem => {
          if (problem.location && problem.location.coordinates && problem.location.coordinates.lat && problem.location.coordinates.lng) {
            return (
              <Marker
                key={problem._id}
                position={[problem.location.coordinates.lat, problem.location.coordinates.lng]}
                icon={getAwesomeMarkerIcon(problem.status)} // Apply the custom icon based on status
              >
                <Popup>
                  <b>{problem.title}</b><br />
                  Category: {problem.category}<br />
                  Status: {problem.status}
                </Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default ProblemMap;
