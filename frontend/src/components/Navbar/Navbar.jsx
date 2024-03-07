import React from "react";
import "../Navbar/Navbar.css";
import logo_dark from "../../assets/logo.svg";
import { Search } from "@mui/icons-material";

function Navbar() {
  return (
    <div className="navbar">
      <div className="left">
        <div className="search-bar-container">
          <input type="text" placeholder="Search" className="search-bar" />
          <Search
            style={{ color: "gray", fontSize: 16, position: "absolute" }}
          />
        </div>
      </div>
      <div className="center">
        <a href="/">
          <img src={logo_dark} alt="Logo" className="logo" />
        </a>
      </div>
      <div className="right">
        <nav>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/recipe">Recipes</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
