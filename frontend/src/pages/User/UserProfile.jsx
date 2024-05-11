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

  const [editedData, setEditedData] = useState({ ...userData });
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    // Here you can add code to save the edited data, such as making an API request

    // For now, we'll update the userData state with the edited data
    setUserData({ ...editedData });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset editedData to userData to cancel editing
    setEditedData({ ...userData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            <div className="head">
              <h2>User Profile</h2>
            </div>
          </div>
          <div className="user-details">
            <div className="detail-item">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.name}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>
          </div>
          <div className="button-group">
            {isEditing ? (
              <>
                <button className="save-button" onClick={handleSaveChanges}>
                  Save Changes
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-button" onClick={handleEditProfile}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
