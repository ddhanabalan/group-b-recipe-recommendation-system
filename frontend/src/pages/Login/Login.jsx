import React, { useState } from "react";
import logo_dark from "../../assets/logo.svg";
import login_image from "../../assets/loginpic.jpg";
import "../../styles/Login.css";
import Validation from "./Validation";
import axios from "axios";
import { setAuthToken } from "../../utils/auth";

function Login() {
  const [values, setValues] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    // Define handleChange function
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(Validation(values));
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/login/", {
          username: values.name,
          password: values.password,
        });

        const token = response.data.token;
        setAuthToken(token); // Store the token

        console.log("Login successful:", response.data);

        // Redirect based on user role
        if (response.data.role === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/home";
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ invalidCredentials: "Invalid username or password" });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <a href="/home">
            <img src={logo_dark} alt="FlavorFuse" className="logo-image" />
          </a>
        </div>
        <div className="header">
          <h2 className="login-header">Log in to your Account</h2>
        </div>
        <div className="login-content">
          <form
            className="form-input"
            onSubmit={handleSubmit}
            style={{ paddingLeft: 5, border: "none" }}
          >
            <input
              type="text"
              placeholder="Username"
              className="form-input-name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p style={{ color: "red", fontSize: "13px" }}>{errors.name}</p>
            )}
            <br />
            <input
              type="password"
              placeholder="Password"
              className="form-input-password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.password}
              </p>
            )}
            {errors.invalidCredentials && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.invalidCredentials}
              </p>
            )}
            <div className="form-options">
              <p className="forget-password">
                <a href="/ForgotPassword">Forget Password ?</a>
              </p>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/Signup">Create an account</a>
          </p>
        </div>
      </div>
      <div className="image-container">
        <img
          src={login_image}
          alt="Background"
          className="background-image"
          loading="eager"
        />
      </div>
    </div>
  );
}

export default Login;
