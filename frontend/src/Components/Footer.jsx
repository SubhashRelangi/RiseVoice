import React from "react";
import "../StyleSheets/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <h2>GovConnect</h2>
          <p>Connecting citizens with essential services quickly and easily.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/track">Track</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        {/* Services Shortcuts */}
        <div className="footer-services">
          <h3>Departments</h3>
          <ul>
            <li><a href="/">Electricity</a></li>
            <li><a href="/">Transport</a></li>
            <li><a href="/">Health Care</a></li>
            <li><a href="/">Water</a></li>
            <li><a href="/">Sanitation</a></li>
            <li><a href="/">Police/Grievance</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: support@govconnect.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="social-icons">
            <a href="#">🌐</a>
            <a href="#">🐦</a>
            <a href="#">📘</a>
            <a href="#">📸</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GovConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
