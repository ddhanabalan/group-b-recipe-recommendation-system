import React, { useState } from "react";
import logo_dark from "../../assets/logo.svg";
import Sign_image from "../../assets/signuppic.jpg";
import "../../styles/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useHistory for redirection

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const history = useNavigate(); // Create history object for redirection

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setPasswordError(
        "Password must be at least 6 characters long, with at least one uppercase letter, one lowercase letter, one special character, and one digit."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/authentication/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Signup successful:", data);
        const email = data.email; // Extract email from response
        console.log("Email from response:", email); // Log the email from the response
        localStorage.setItem("signupEmail", email); // Store email in localStorage
        history(`/otp/${email}`); // Redirect to OTP page with email parameter
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="sign-container">
      <div className="login-form-container">
        <div className="logo-container">
          <a href="/home">
            <img src={logo_dark} alt="FlavorFuse" className="logo-image" />
          </a>
        </div>
        <h2 className="sign-header">Create Your Account</h2>

        <form className="sign-form" onSubmit={handleSignup}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="form-input"
            size={4}
            value={formData.username}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            size={4}
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
          />
          {passwordError && (
            <p className="error-message">
              Password must be at least 6 characters long and contain <br />
              digits, special characters, capital letters, and small letters.
            </p>
          )}
          <div className="form-button">
            <button type="submit" className="signup-button">
              SIGN UP
            </button>
          </div>
        </form>
        <p className="login-link">
          Already have an account ? <a href="/login">Login</a>
        </p>
      </div>
      <div className="image-container">
        <img
          src={Sign_image}
          alt="Background"
          className="background-image"
          loading="eager"
        />
      </div>
    </div>
  );
}

export default Signup;
