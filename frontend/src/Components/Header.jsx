import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/departments/logout', {}, { withCredentials: true });
      Cookies.remove('jwtToken');
      localStorage.removeItem('departmentDetails'); // Remove department details from localStorage
      setIsLoggedIn(false);
      navigate('/department/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.brand}>
        <h1 className={styles.title}>VoiceUp</h1>
      </div>

      {/* Hamburger Menu */}
      <div
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ''}`}>
        {isLoggedIn ? (
          <>
            <a href="/department" className={styles.navLinkEle}>
              Home
            </a>
            <a href="/department/complaints" className={styles.navLinkEle}>
              Complaints
            </a>
            <a href="/department/profile" className={styles.navLinkEle}>
              Profile
            </a>
            <button onClick={handleLogout} className={styles.navLinkEle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/" className={styles.navLinkEle}>
              Home
            </a>
            <a href="/track" className={styles.navLinkEle}>
              Track
            </a>
            <a href="/department/login" className={styles.navLinkEle}>
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;