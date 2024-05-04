import React, { useState } from "react";
import Swal from "sweetalert2";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/User.css";
import "../../styles/UserFeedback.css";

const UserFeedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.email &&
      formData.category &&
      formData.message
    ) {
      // Process form submission
      setFormData({
        name: "",
        email: "",
        category: "",
        message: "",
      });
      Swal.fire({
        title: "Thank you!",
        text: "Your feedback has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        icon: null,
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="usercontainer">
        <div className="usersidebar">
          <UserSideBar />
        </div>
        <div className="user-content-section">
          <div
            className="user-content-heading"
            style={{
              justifyContent: "center",
              paddingTop: 20,
              paddingRight: 50,
            }}
          >
            <h2>Give Your Feedback</h2>
            <hr />
          </div>
          <div className="user-content-item">
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category">Category:</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="complaint">Complaint</option>
                    <option value="bug">Bug</option>
                    <option value="general">General</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message">Message:</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserFeedback;
