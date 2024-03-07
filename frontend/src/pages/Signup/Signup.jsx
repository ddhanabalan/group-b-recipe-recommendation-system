import React from "react";
import logo_dark from "../../assets/logo.svg";
import Sign_image from "../../assets/signuppic.jpg";
import "./Signup.css";
function Signup() {
  return (
    <div className="sign-container">
      <div className="login-form-container">
        <div className="logo-container">
          <a href="/home">
            <img src={logo_dark} alt="FlavorFuse" className="logo-image" />
          </a>
        </div>
        <h2 className="sign-header">Create Your Account</h2>

        <form className="sign-form">
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            size={4}
          />
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            size={4}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
          />
          <div className="form-button">
            <button type="submit" className="signup-button">
              SIGN UP
            </button>
          </div>
        </form>
        <p className="login-link">
          Already have an account ? <a href="/Login">Login</a>
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
