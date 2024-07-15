import React, { useState, useContext, useEffect, useRef } from "react";
import "../../styles/Navbar.css";
import logo_dark from "../../assets/logo.svg";
import { Search } from "@mui/icons-material";
import { RecipeContext } from "../../context/recipeContext";
import { isAuthenticated, getAuthToken, clearAuthData } from "../../utils/auth";
import axios from "axios";
import { FaUser } from "react-icons/fa";

function AdminNavbar() {
  {
    /*const handleLogout = async () => {
    try {
      // Call your logout API endpoint here
      const response = await fetch(
        "http://localhost:8000/authentication/logout/",
        {
          method: "POST", // Assuming your logout endpoint uses POST method
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      clearAuthToken();
      clearUserId();

      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };*/
  }

  const handleLogout = async () => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        "http://localhost:8000/authentication/logout/",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      clearAuthData();
      window.location.href = "/login";
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = "/login";
      } else {
        console.error("Error logging out:", error);
      }
    }
  };

  const authToken = isAuthenticated();

  return (
    <div className="navbar">
      <div className="left" style={{ marginLeft: 60 }}>
        <a href="/dashboard">
          <img src={logo_dark} alt="Logo" className="logo" />
        </a>
      </div>

      <div className="right">
        <nav>
          <ul>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  fontSize: 20,
                  border: "0.5px solid black",
                  borderRadius: "5px",
                  padding: "8px 30px",
                  background: "none",
                  marginLeft: "50%",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </li>

            {/*{authToken ? (
              <li className="dropdown-container">
                <div
                  className="user-icon"
                  onClick={toggleDropdown}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <span className="user-heading">User</span>
                  {showDropdown && (
                    <ul className="dropdown">
                      <li>
                        <a href="/user/savedrecipes">Dashboard</a>
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
                <span
                  className="user-heading"
                  onClick={() => (window.location.href = "/login")}
                >
                  login
                </span>
              </li>
            )}*/}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default AdminNavbar;
