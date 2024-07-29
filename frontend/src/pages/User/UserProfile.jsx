import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaPencilAlt } from "react-icons/fa";
import "../../styles/UserProfile.css";
import {
  isAuthenticated,
  getUserRole,
  getUserId,
  getUserName,
  getUserEmail,
  setUserName,
  getAuthToken,
  clearAuthData,
  setAuthToken,
} from "../../utils/auth";
import axios from "axios";
import { toast } from "react-toastify";
import UserHistory from "../../components/userHistory/UserHistory";

const UserProfile = () => {
  const history = useNavigate();
  const userId = getUserId();

  const [editedData, setEditedData] = useState({
    name: getUserName(),
    email: getUserEmail(),
  });
  const [isEditing, setIsEditing] = useState(false);

  /*const [preferences, setPreferences] = useState({
    food_type: "",
    preference: [],
  });*/

  useEffect(() => {
    // Check if user is authenticated and has user role
    if (!isAuthenticated() || getUserRole() !== "user") {
      history("/login");
    } /*else {
      fetchPreferences();
    }*/
  }, [history]);

  /* const fetchPreferences = async () => {
    try {
      const { access: accessToken } = getAuthToken();
      const response = await axios.get(
        "http://localhost:8000/authentication/userpreferences/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };*/

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditedData({
      name: getUserName(),
      email: getUserEmail(),
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        "http://localhost:8000/authentication/change-username/",
        { new_username: editedData.name, userid: userId },
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      setUserName(editedData.name);
      setIsEditing(false);
      toast.success("Username updated successfully.", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        closeButton: false,
        style: {
          height: "50px",
          border: "2px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized error:", error);
        await handleUnauthorizedError();
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.new_username
      ) {
        // Username already taken error
        const errorMessage = error.response.data.new_username.join(" ");
        toast.error(`Failed to update username: ${errorMessage}`, {
          autoClose: 4000, // Auto close the toast after 4 seconds
          hideProgressBar: false, // Show the progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: true, // Pause closing the toast on hover
          draggable: true, // Allow dragging the toast
          closeButton: true, // Show a close button on the toast
          style: {
            background: "#f44336", // Background color of the toast
            color: "#ffffff", // Text color
            border: "1px solid #ffffff", // Border style
            borderRadius: "5px", // Border radius
            padding: "16px", // Padding around the toast content
          },
        });
      } else {
        console.error("Error updating username:", error);

        toast.error(`Failed to update username. Please try again later.`, {
          autoClose: 4000, // Auto close the toast after 4 seconds
          hideProgressBar: false, // Show the progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: true, // Pause closing the toast on hover
          draggable: true, // Allow dragging the toast
          closeButton: true, // Show a close button on the toast
          style: {
            background: "#f44336", // Background color of the toast
            color: "#ffffff", // Text color
            border: "1px solid #ffffff", // Border style
            borderRadius: "5px", // Border radius
            padding: "10px", // Padding around the toast content
          },
        });
      }
    }
  };

  const handleUnauthorizedError = async () => {
    try {
      const { refresh: refreshToken } = getAuthToken();
      const response = await axios.post(
        "http://localhost:8000/authentication/token/refresh/",
        { refresh: refreshToken }
      );
      const { access, refresh } = response.data;
      setAuthToken({ access, refresh });
      await handleSubmit(); // Retry submitting after token refresh
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData(); // Clear auth data on token refresh failure
      history("/login");
    }
  };

  const handleChangePassword = () => {
    history("/changepassword");
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
                <>
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleChange}
                    className="username_field"
                  />
                  <button onClick={handleSubmit} className="okbtn">
                    Submit
                  </button>
                  <button onClick={handleCancelEdit} className="cancelbtn">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{editedData.name}</span>
                  <FaPencilAlt
                    className="edit-icon"
                    onClick={handleToggleEdit}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{editedData.email}</span>
            </div>
            {/* <div className="user-preferences">
              <div className="preference-item" style={{ display: "flex" }}>
                <label>Food Type:</label>
                <span className="preference-food-type">
                  {preferences.food_type}
                </span>
              </div>
              <div className="preference-item">
                <label>Preferred Cuisines:</label>
                <ul className="preference-list">
                  {preferences.preference.map((pref, index) => (
                    <li key={index} className="preference-list-item">
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            <div className="detail-item">
              <button
                onClick={handleChangePassword}
                className="changepasswordbtn"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="user-history">
            <UserHistory />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
