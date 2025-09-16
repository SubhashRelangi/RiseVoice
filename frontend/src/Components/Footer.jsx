import React from 'react';
import styles from './Footer.module.css';
import { FaGlobe, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';  

const Footer = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { sectionId } });
    }
  };

  const handleDepartmentClick = (category) => {
    navigate('/raise-complaint', { state: { category } });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>

        {/* Brand Section */}
        <div className={styles.footerBrand}>
          <h2>GovConnect</h2>
          <p>Connecting citizens with essential services quickly and easily.</p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><a onClick={() => handleScroll('hero-section')}>Home</a></li>
            <li><a onClick={() => handleScroll('services-section')}>Services</a></li>
            <li><a href="/track">Track</a></li>
            <li><a href="/department/login">Login</a></li>
          </ul>
        </div>

        {/* Services Shortcuts */}
        <div className={styles.footerServices}>
          <h3>Departments</h3>
          <ul>
            <li><a onClick={() => handleDepartmentClick('ELECTRICITY')}>Electricity</a></li>
            <li><a onClick={() => handleDepartmentClick('TRANSPORT')}>Transport</a></li>
            <li><a onClick={() => handleDepartmentClick('HEALTHCARE')}>Health Care</a></li>
            <li><a onClick={() => handleDepartmentClick('WATER')}>Water</a></li>
            <li><a onClick={() => handleDepartmentClick('WASTE_MANAGEMENT')}>Sanitation</a></li>
            <li><a onClick={() => handleDepartmentClick('POLICE')}>Police/Grievance</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.footerContact}>
          <h3>Contact</h3>
          <p>Email: risevoiceproject@gmail.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className={styles.socialIcons}>
            <a href="/"><FaGlobe /></a>
            <a href="/"><FaTwitter /></a>
            <a href="/"><FaFacebook /></a>
            <a href="/"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} GovConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
