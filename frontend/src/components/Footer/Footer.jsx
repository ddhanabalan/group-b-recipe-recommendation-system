import React from "react";
import "./Footer.css";
import logo_light from "../../assets/logo_light.svg";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import CopyrightIcon from "@mui/icons-material/Copyright";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-details">
        <div className="footer-logo">
          <img src={logo_light} alt="flavorFuse" />
        </div>
        <div className="footer-icons">
          <FaFacebook style={{ fontSize: 40, padding: 6 }} />
          <AiFillTwitterCircle style={{ fontSize: 40, padding: 6 }} />
          <FaInstagram style={{ fontSize: 40, padding: 6 }} />
          <MdAlternateEmail style={{ fontSize: 40, padding: 6 }} />
          <FaYoutube style={{ fontSize: 40, padding: 6 }} />
          <div className="lang">
            <button>English</button>
          </div>
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
