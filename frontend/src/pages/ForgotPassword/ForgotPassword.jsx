import React, { useState } from "react";
import axios from "axios";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

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
        "http://localhost:8000/forgot-password/",
        {
          username: formData.username,
          email: formData.email,
        }
      );
      console.log(response.data);
      alert("Password reset email sent successfully.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Failed to send password reset email.");
    }
  };

  return (
    <div className="forgotpassword">
      <div className="card" style={{ height: 270 }}>
        <h1 align="center">Reset Your Password</h1>
        <form className="form1" onSubmit={handleSubmit}>
          <table width="285" rules="none" cellPadding="10px">
            <tr>
              <td style={{ fontSize: 20, fontFamily: "Poppins" }}>Username</td>
              <td style={{ fontSize: 20, fontFamily: "Playfair Display" }}>
                <input
                  type="text"
                  name="username"
                  className="txtname"
                  value={formData.username}
                  onChange={handleChange}
                  style={{ fontSize: 18, fontFamily: "Playfair Display" }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 20, fontFamily: "Poppins" }}>E-mail</td>
              <td style={{ fontSize: 20, fontFamily: "Playfair Display" }}>
                <input
                  type="email"
                  name="email"
                  className="txtemail"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ fontSize: 18, fontFamily: "Playfair Display" }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                align="center"
                style={{ fontSize: 22, fontFamily: "Poppins" }}
              >
                <input
                  type="submit"
                  className="btnotp"
                  id="btnotp"
                  value="Submit"
                  style={{
                    background: "#e1792f",
                    color: "#fff",
                    cursor: "pointer",
                    padding: 10,
                    border: "none",
                    borderRadius: 5,
                    width: 100,
                  }}
                />
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
