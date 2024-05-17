import React, { useState } from "react";
import axios from "axios";
import "../../styles/PasswordReset.css";
import { getUserId, getAuthToken } from "../../utils/auth"; // Importing the functions from auth.js

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "txtnewpwd") {
      setNewPassword(value);
    } else if (name === "txtconpwd") {
      setConfirmNewPassword(value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    const userId = getUserId().toString();
    const authToken = getAuthToken().toString();

    try {
      const response = await fetch(
        `http://localhost:8000/authentication/reset/${userId}/${authToken}/`, // Ensure this URL matches your Django endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set Content-Type header
          },
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmNewPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password.");
      }

      // Optionally, you can check the response data here if needed

      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };

  return (
    <div className="changepassword">
      <div className="card-reset">
        <h1 className="reset-head" align="center">
          Password Reset
        </h1>
        <form id="form1" name="form1" onSubmit={handleSubmit}>
          <table width="285" rules="none" cellPadding="10px" id="reset-table">
            <tr>
              <td
                style={{
                  fontSize: "20px",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                New Password:
              </td>
              <td
                style={{
                  fontSize: "20px",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <input
                  type="password"
                  name="txtnewpwd"
                  id="txtnewpwd"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,10}"
                  title="Must contain at least one number and one uppercase and one special character and lowercase letter, and at least 6 or more characters"
                  value={newPassword}
                  onChange={handleChange}
                />
                <i
                  id="togglePassword"
                  className="fas fa-eye"
                  style={{
                    color: "orange",
                    left: "133px",
                    top: "-32px",
                    position: "relative",
                  }}
                ></i>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "20px",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Confirm New Password:
              </td>
              <td
                style={{
                  fontSize: "20px",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <input
                  type="password"
                  name="txtconpwd"
                  id="txtconpwd"
                  value={confirmNewPassword}
                  onChange={handleChange}
                />
                <i
                  id="togglePassword2"
                  className="fas fa-eye"
                  style={{
                    color: "orange",
                    left: "133px",
                    top: "-32px",
                    position: "relative",
                  }}
                ></i>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "20px",
                  fontFamily: "Playfair Display, serif",
                }}
                colspan="2"
                align="center"
              >
                <input
                  type="submit"
                  name="btnsubmit"
                  id="btnsubmit"
                  value="Update"
                  style={{
                    background: " #e1792f",
                    color: "#fff",
                    cursor: "pointer",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    width: "100%",
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

export default PasswordReset;
