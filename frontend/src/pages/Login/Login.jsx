import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Adjust the import path based on your project structure
import logo_dark from "../../assets/logo.svg";
import login_image from "../../assets/loginpic.jpg";
import "../../styles/Login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setAuthToken,
  setUserId,
  setUserEmail,
  setUserName,
  setUserRole,
} from "../../utils/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/authentication/login/", {
        username: values.name,
        password: values.password,
      });

      const { userid, username, email, role } = response.data.user;
      const { access, refresh } = response.data;

      setUserId(userid);
      setUserName(username);
      setUserEmail(email);
      setUserRole(role);
      setAuthToken({ access, refresh });

      // Fetch user preferences
      const preferencesResponse = await axiosInstance.get(
        "/authentication/userpreferences",
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      const { preference, food_type } = preferencesResponse.data;
      // console.log("User Preferences:", { preference, food_type });
      localStorage.setItem(
        "userPreferences",
        JSON.stringify({ preference, food_type })
      );

      toast.success("Logged in successfully.", {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        closeButton: false,
        style: {
          height: "50px",
          border: "2px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
        },
      });

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        if (!preference || !food_type) {
          navigate("/recommendation");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.status === 401) {
        setErrors({ invalidCredentials: "Invalid username or password" });
      } else {
        setErrors({
          generalError: "An error occurred. Please try again later.",
        });
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
          <p className="signup-link" style={{ marginTop: "5px" }}>
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
