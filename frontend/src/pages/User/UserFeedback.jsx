import React, { useState } from "react";
import Swal from "sweetalert2";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/User.css";
import "../../styles/UserFeedback.css";
import { getAuthToken, getUserId } from "../../utils/auth";

const UserFeedback = () => {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    const accessToken = getAuthToken();
    if (formData.category && formData.message) {
      const dataToSend = {
        userid: userId,
        category: formData.category,
        feedback: formData.message,
      };
      console.log("Data to send to API:", dataToSend); // Log the data being sent

      try {
        const response = await fetch(
          "http://localhost:8000/authentication/addfeedback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(dataToSend),
          }
        );

        const responseData = await response.json(); // Parse response data as JSON

        if (!response.ok) {
          throw new Error(responseData.message || "Server Error");
        }

        if (responseData.success) {
          setFormData({
            category: "",
            message: "",
          });
          Swal.fire({
            title: "Thank you!",
            text: "Your feedback has been submitted successfully.",

            confirmButtonText: "OK",
          });
        } else {
          throw new Error(responseData.message || "Failed to submit feedback");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error.message);
        Swal.fire({
          title: "Error",
          text:
            error.message ||
            "Failed to submit feedback. Please try again later.",

          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields before submitting.",

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
            <div className="card-feedback">
              <form onSubmit={handleSubmit}>
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
