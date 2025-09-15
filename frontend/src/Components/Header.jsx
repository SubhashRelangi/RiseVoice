import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Header.module.css';
import axiosInstance from '../axiosInstance';
import { FaHome, FaSearch, FaRegListAlt, FaUser, FaBuilding, FaChevronDown } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hamburgerRef.current && hamburgerRef.current.contains(event.target)) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, hamburgerRef, dropdownRef]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/departments/logout');
      setIsLoggedIn(false);
      setMenuOpen(false);
      navigate('/department/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.navigation}>
      <Link to={isLoggedIn ? '/department' : '/'} className={styles.brandLink}>
        <div className={styles.brand}>
          <h1 className={styles.title}>RiseVoice</h1>
        </div>
      </Link>

      {/* Hamburger Menu */}
      <div
        ref={hamburgerRef}
        className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <div ref={menuRef} className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ''}`}>
        {isLoggedIn ? (
          <>
            <Link to="/department" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/department') ? styles.active : ''}`}>
              <FaHome className={styles.icon} />
              <span>Home</span>
            </Link>
            <Link to="/department/complaints" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/department/complaints') ? styles.active : ''}`}>
              <FaRegListAlt className={styles.icon} />
              <span>Complaints</span>
            </Link>
            <Link to="/department/profile" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/department/profile') ? styles.active : ''}`}>
              <FaUser className={styles.icon} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className={`${styles.navLinkEle} ${styles.logoutButton}`}>
              <FiLogOut className={styles.icon} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/') ? styles.active : ''}`}>
              <FaHome className={styles.icon} />
              <span>Home</span>
            </Link>
            <Link to="/track" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/track') ? styles.active : ''}`}>
              <FaSearch className={styles.icon} />
              <span>Track</span>
            </Link>
            <div className={styles.dropdown} ref={dropdownRef}>
              <div className={styles.navLinkEle} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaBuilding className={styles.icon} />
                <span>Login</span>
                <FaChevronDown className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`} />
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/department/login" onClick={handleLinkClick} className={styles.dropdownLink}>
                    Department Login
                  </Link>
                  <Link to="/admin/login" onClick={handleLinkClick} className={styles.dropdownLink}>
                    Admin Login
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
