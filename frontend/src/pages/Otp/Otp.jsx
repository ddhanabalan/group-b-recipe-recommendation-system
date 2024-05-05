import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import "../../styles/ForgotPassword.css";

const Otp = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    if (email) {
      setFormData({ ...formData, email });
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim(),
    });
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Request body sent to server:", {
        email: formData.email,
        vericode: formData.otp,
      }); // Log the request body sent to the server

      const response = await fetch(
        "http://localhost:8000/authentication/verify-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            vericode: formData.otp,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Response from server:", data); // Log the response content
        alert("Email verified successfully.");
        // Redirect to login page after successful email verification
        window.location.href = "/login";
      } else {
        const data = await response.json();
        setVerificationError(data.message || "Failed to verify email.");
      }
    } catch (error) {
      console.error("Error verifying email:", error.message);
      setVerificationError("Failed to verify email.");
    }
  };
  return (
    <div className="forgotpassword">
      <div className="card" style={{ height: 270 }}>
        <h1 align="center">Enter OTP</h1>
        <form className="form1" onSubmit={handleOTPSubmit}>
          <table width="285" rules="none" cellPadding="10px">
            <tr>
              <td style={{ fontSize: 20, fontFamily: "Playfair Display" }}>
                <input
                  type="text"
                  name="otp"
                  className="txtotp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  style={{ fontSize: 18, fontFamily: "Playfair Display" }}
                />
              </td>
            </tr>
            {verificationError && (
              <tr>
                <td
                  colSpan="2"
                  align="center"
                  style={{ fontSize: 18, color: "red" }}
                >
                  {verificationError}
                </td>
              </tr>
            )}
            <tr>
              <td
                colSpan="2"
                align="center"
                style={{ fontSize: 22, fontFamily: "Poppins" }}
              >
                <input
                  type="submit"
                  className="btnsubmitotp"
                  id="btnsubmitotp"
                  value="Submit OTP"
                  style={{
                    background: "#e1792f",
                    color: "#fff",
                    cursor: "pointer",
                    padding: 10,
                    border: "none",
                    borderRadius: 5,
                    width: 150,
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

export default Otp;
