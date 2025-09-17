import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Header.module.css';
import axiosInstance from '../axiosInstance';
import { useAuth } from './Auth/AuthContext'; // Import useAuth
import { FaHome, FaSearch, FaRegListAlt, FaUser, FaBuilding, FaChevronDown, FaTasks } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { GrAnnounce } from 'react-icons/gr';


const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, setIsAdminAuthenticated } = useAuth(); // Get admin auth state
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

  const handleDepartmentLogout = async () => {
    try {
      await axiosInstance.post('/api/departments/logout');
      setIsLoggedIn(false);
      setMenuOpen(false);
      navigate('/department/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await axiosInstance.post('/api/admin/auth/logout');
      setIsAdminAuthenticated(false);
      setMenuOpen(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Determine brand link based on authentication
  const getBrandLink = () => {
    if (isAdminAuthenticated) {
      return '/admin/dashboard';
    }
    if (isLoggedIn) {
      return '/department';
    }
    return '/';
  };

  return (
    <div className={styles.navigation}>
      <Link to={getBrandLink()} className={styles.brandLink}>
        <div className={styles.brand}>
          <h1 className={styles.title}>{isAdminAuthenticated ? 'AdminDashboard' : 'RiseVoice'}</h1>
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
        {isAdminAuthenticated ? (
          <>
            <Link to="/admin/dashboard" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/admin/dashboard') ? styles.active : ''}`}>
              <FaHome className={styles.icon} />
              <span>Home</span>
            </Link>
            <Link to="/admin/departments" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/admin/departments') ? styles.active : ''}`}>
              <FaBuilding className={styles.icon} />
              <span>Departments</span>
            </Link>
            <Link to="/admin/requests" onClick={handleLinkClick} className={`${styles.navLinkEle} ${isActive('/admin/requests') ? styles.active : ''}`}>
              <GrAnnounce className={styles.icon} />
              <span>Requests</span>
            </Link>
            <button onClick={handleAdminLogout} className={`${styles.navLinkEle} ${styles.logoutButton}`}>
              <FiLogOut className={styles.icon} />
              <span>Logout</span>
            </button>
          </>
        ) : isLoggedIn ? (
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
            <button onClick={handleDepartmentLogout} className={`${styles.navLinkEle} ${styles.logoutButton}`}>
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
