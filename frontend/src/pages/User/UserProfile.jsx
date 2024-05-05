import React, { useState } from "react";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/UserProfile.css";

const UserProfile = () => {
  // Sample user data (replace with actual user data from your context or API)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password", // Just an example, never store passwords in state
  });

  const handleEditProfile = () => {
    window.location.href = "/editprofile";
  };

  return (
    <div>
      <Navbar />
      <div className="usercontainer">
        <div className="usersidebar">
          <UserSideBar />
        </div>
        <div className="user-content-section">
          <div className="user-profile-heading">
            <div className="profile-icon">
              <FaUserCircle size={60} />
            </div>
            <div className="head">
              <h2>User Profile</h2>
            </div>
          </div>
          <div className="user-details">
            <div className="detail-item">
              <label>Name:</label>
              <span>{userData.name}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{userData.email}</span>
            </div>
          </div>
          <div className="button-group">
            <button className="edit-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
