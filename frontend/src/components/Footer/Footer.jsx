import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p>
            Hello! Welcome to Foody World — eat and enjoy as much as you want,
            but remember to eat only what your body truly needs.
          </p>

          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* Center Section */}
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>9802314452</li>
            <li>dikimanucompany@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />

      <p className="footer-copyright">
        Copyright © 2025 Dikimanu.com — All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
