import React, { useState } from "react";
import "../StyleSheets/Navigation.css";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navigation">
      <div className="brand">
        <h1 className="Title">VoiceUp</h1>
      </div>

      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <div className={`navLinks ${menuOpen ? "active" : ""}`}>
        <a href="#" className="navLinkEle">
          Home
        </a>
        <a href="#" className="navLinkEle">
          Services
        </a>
        <a href="#" className="navLinkEle">
          Track
        </a>
        <a href="#" className="navLinkEle">
          Login
        </a>
      </div>
    </div>
  );
};

export default Navigation;
