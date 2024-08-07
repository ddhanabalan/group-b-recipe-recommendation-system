import React, { useState } from "react";
import logo_dark from "../../assets/logo.svg";
import Sign_image from "../../assets/signuppic.jpg";
import "../../styles/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle button disabling
  const navigate = useNavigate();

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
    setPasswordError("");
    setUsernameError("");
    setEmailError("");
    setGeneralError("");
    setIsSubmitting(true); // Disable the button when form is submitted

    if (!validatePassword(formData.password)) {
      setPasswordError(
        "Password must be at least 6 characters long, with at least one uppercase letter, one lowercase letter, one special character, and one digit."
      );
      setIsSubmitting(false); // Re-enable the button if validation fails
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/authentication/signup/",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        const username = formData.username;
        localStorage.setItem("signupUsername", username);
        navigate(`/otp/${username}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.username) {
          setUsernameError(
            Array.isArray(errorData.username)
              ? errorData.username.join(" ")
              : errorData.username
          );
        }
        if (errorData.email) {
          setEmailError(
            Array.isArray(errorData.email)
              ? errorData.email.join(" ")
              : errorData.email
          );
        }
        if (!errorData.username && !errorData.email) {
          setGeneralError("Signup failed. Please try again.");
        }
      } else {
        setGeneralError("Error during signup. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after processing the form
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
          {passwordError && <p className="error-message">{passwordError}</p>}
          {usernameError && <p className="error-message">{usernameError}</p>}
          {emailError && <p className="error-message">{emailError}</p>}
          {generalError && <p className="error-message">{generalError}</p>}
          <div className="form-button">
            <button
              type="submit"
              className="signup-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "SIGN UP"}
            </button>
          </div>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
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
