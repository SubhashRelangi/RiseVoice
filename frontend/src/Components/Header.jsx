import React from 'react'
import { useState } from "react";
import styles from "./Header.module.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ""}`}>
        <a href="/" className={styles.navLinkEle}>
          Home
        </a>
        <a href="/" className={styles.navLinkEle}>
          Services
        </a>
        <a href="/track" className={styles.navLinkEle}>
          Track
        </a>
        <a href="/department/login" className={styles.navLinkEle}>
          Login
        </a>
      </div>
    </div>
  );
};

export default Header;