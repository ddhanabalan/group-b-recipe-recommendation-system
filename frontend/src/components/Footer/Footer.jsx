import React from "react";
import "../../styles/Footer.css";
import logo_light from "../../assets/logo_light.svg";

import CopyrightIcon from "@mui/icons-material/Copyright";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-details">
        <div className="footer-logo">
          <img src={logo_light} alt="flavorFuse" />
        </div>
        <div className="footer-icons">
          <a href="/home">Home</a> <span>|</span>
          <a href="/recipe">Recipes</a>
          <span>|</span>
          <a href="/about">About Us</a>
        </div>
        <hr />
        <div className="footer-copyright">
          <CopyrightIcon style={{ paddingRight: 5 }} />
          copyrights @ 2024 - All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
