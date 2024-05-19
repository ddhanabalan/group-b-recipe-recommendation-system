import React, { useState } from "react";
import "../../styles/ChangePassword.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { getAuthToken, clearAuthData } from "../../utils/auth";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const authToken = getAuthToken();
      const response = await axios.put(
        "http://localhost:8000/authentication/change-password/",
        {
          password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      alert("Password changed successfully.");
      history("/user/profile");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthData();
        history("/login");
      } else {
        console.error("Error changing password:", error);
        alert("Failed to change password.");
      }
    }
  };

  return (
    <div className="change-password">
      <div className="card-change">
        <h1 className="change-head" align="center">
          Change Password
        </h1>
        <form onSubmit={handleSubmit}>
          <table width="400" rules="none" cellPadding="10px" id="change-table">
            <tbody>
              <tr>
                <td>Old Password:</td>
                <td>
                  <input
                    type="password"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>New Password:</td>
                <td>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Confirm New Password:</td>
                <td>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2" align="center">
                  <input
                    type="submit"
                    value="Change Password"
                    className="change-button"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
