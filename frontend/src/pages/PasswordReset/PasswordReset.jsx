import React, { useState } from "react";
import "../../styles/PasswordReset.css"; // Make sure to adjust this import if needed
import { useNavigate } from "react-router";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const pathParts = window.location.pathname.split("/");
  const userId = pathParts[2];
  const authToken = pathParts[3];

  const history = useNavigate();

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

    try {
      const response = await fetch(
        `http://localhost:8000/authentication/reset/${userId}/${authToken}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

      alert("Password updated successfully.");
      history("/login");
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password.");
    }
  };

  return (
    <div className="changepassword">
      <div className="card-reset">
        <h1 className="reset-head" align="center">
          Password Reset
        </h1>
        <div className="form-container">
          <form id="form1" name="form1" onSubmit={handleSubmit}>
            <table width="285" rules="none" cellPadding="10px" id="reset-table">
              <tbody>
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
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}"
                      title="Must contain at least one number, one uppercase and one special character, one lowercase letter, and be 6 to 20 characters long"
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
                    colSpan="2"
                    align="center"
                  >
                    <input
                      type="submit"
                      name="btnsubmit"
                      id="btnsubmit"
                      value="Update"
                      style={{
                        background: "#e1792f",
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
              </tbody>
            </table>
          </form>
          {error && (
            <p className="error-message" align="center">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
