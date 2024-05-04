import React, { useState } from "react";
import "../../styles/Navbar.css";
import logo_dark from "../../assets/logo.svg";
import { Search } from "@mui/icons-material";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="navbar">
      <div className="left">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Type to search"
            className="search-bar"
          />
          <Search
            style={{
              color: "gray",
              fontSize: 16,
              position: "absolute",
              paddingLeft: 10,
            }}
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
            {isLoggedIn ? (
              <li className="dropdown-container">
                <div
                  className="user-icon"
                  onClick={toggleDropdown}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <img
                    src="/path/to/user-icon.png" // Replace with actual user icon path
                    alt="User Icon"
                    className="user-icon-img"
                  />
                  {showDropdown && (
                    <ul className="dropdown">
                      <li>
                        <a href="/user/savedrecipes">Dashboard</a>
                      </li>
                      <li>
                        <a href="/changepassword">Change Password</a>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ) : (
              <li>
                <a href="/login">Login</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
