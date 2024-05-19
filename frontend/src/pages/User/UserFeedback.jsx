import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/User.css";
import "../../styles/UserFeedback.css";
import { clearAuthData, getAuthToken, getUserId } from "../../utils/auth";
import { isAuthenticated, getUserRole } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const UserFeedback = () => {
  const [formData, setFormData] = useState({
    category: "",
    message: "",
  });

  const history = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== "user") {
      history("/login");
      return;
    }
  }, [history]);

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

      try {
        const response = await fetch(
          "http://localhost:8000/authentication/addfeedback/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (response.status === 401) {
          clearAuthData();
          window.location.href = "/login";
          return;
        }

        const responseData = await response.json();

        if (response.status === 201) {
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
          throw new Error(
            responseData.message ||
              `Failed to submit feedback (${response.status})`
          );
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
