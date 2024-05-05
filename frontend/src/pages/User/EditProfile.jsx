import React, { useState } from "react";

import Swal from "sweetalert2"; // Import SweetAlert
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/EditProfile.css";

const EditProfile = () => {
  // Sample user data (replace with actual user data from your context or API)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password", // Just an example, never store passwords in state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your update profile logic here
    console.log("Updated user data:", userData);

    // Show SweetAlert success message
    Swal.fire({
      title: "Success!",
      text: "Profile updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
      icon: null,
    }).then(() => {
      window.location.href = "/user/profile";
    });
  };

  return (
    <div>
      <Navbar />
      <div className="edit-profile-container">
        <div className="edit-profile-heading">
          <h2>Edit Profile</h2>
        </div>
        <div className="edit-profile-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="editsubmit" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
