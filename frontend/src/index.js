import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // Import axios
import { AuthProvider } from './Components/Auth/AuthContext'; // Import AuthProvider

axios.defaults.withCredentials = true; // Configure axios to send cookies

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
);
