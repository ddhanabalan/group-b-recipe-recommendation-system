import React from "react";
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
} from "../../utils/auth";
import axios from "axios";

const UserProfile = () => {
  const history = useNavigate();
  const userId = getUserId();

  const [editedData, setEditedData] = React.useState({
    name: getUserName(),
    email: getUserEmail(),
  });
  const [isEditing, setIsEditing] = React.useState(false);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
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
      const response = await axios.put(
        `http://localhost:8000/authentication/change-username/`,
        { new_username: editedData.name, userid: userId }
      );
      setUserName(editedData.name);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== "user") {
      history("/login");
    }
  }, [history]);

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
                </>
              ) : (
                <>
                  <span>{editedData.name}</span>
                  <FaPencilAlt
                    className="edit-icon"
                    onClick={handleToggleEdit}
                  />
                </>
              )}
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{editedData.email}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
