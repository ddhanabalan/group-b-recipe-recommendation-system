import React, { useState } from "react";
import axios from "axios";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/authentication/forgot-password/",
        {
          username: formData.username,
          email: formData.email,
        }
      );
      console.log(response.data);
      alert("Password reset email sent successfully.");
    } catch (error) {
      console.error("Error sending password reset email:", error.response.data);
      setError(
        "Failed to send password reset email. Please check your inputs."
      );
    }
  };

  return (
    <div className="forgotpassword">
      <div className="card" style={{ height: 270 }}>
        <h1 align="center">Reset Your Password</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="form1" onSubmit={handleSubmit}>
          <table width="285" rules="none" cellPadding="10px">
            <tr>
              <td>Username</td>
              <td>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>E-mail</td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" align="center">
                <input type="submit" value="Submit" className="Submitbtn" />
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
