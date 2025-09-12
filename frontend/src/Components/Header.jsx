import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Header.module.css';
import axiosInstance from '../axiosInstance';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/departments/logout');
      setIsLoggedIn(false);
      navigate('/department/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

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
            <Link to="/department" className={`${styles.navLinkEle} ${isActive('/department') ? styles.active : ''}`}>
              Home
            </Link>
            <Link to="/department/complaints" className={`${styles.navLinkEle} ${isActive('/department/complaints') ? styles.active : ''}`}>
              Complaints
            </Link>
            <Link to="/department/profile" className={`${styles.navLinkEle} ${isActive('/department/profile') ? styles.active : ''}`}>
              Profile
            </Link>
            <button onClick={handleLogout} className={styles.navLinkEle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className={`${styles.navLinkEle} ${isActive('/') ? styles.active : ''}`}>
              Home
            </Link>
            <Link to="/track" className={`${styles.navLinkEle} ${isActive('/track') ? styles.active : ''}`}>
              Track
            </Link>
            <Link to="/department/login" className={`${styles.navLinkEle} ${isActive('/department/login') ? styles.active : ''}`}>
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
