import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faUsers,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import axios from "axios";
import "../../styles/Admin.css";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const Admin = () => {
  const [recipeCount, setRecipeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (!isAuthenticated() || getUserRole() !== "admin") {
          history("/login");
          return;
        }

        const recipeCountResponse = await axios.get(
          "http://localhost:8000/recipe/recipecount/"
        );
        setRecipeCount(recipeCountResponse.data);
        const userCountResponse = await axios.get(
          "http://localhost:8000/authentication/userscount"
        );
        setUserCount(userCountResponse.data);
        const feedbackCountResponse = await axios.get(
          "http://localhost:8000/authentication/feedbackcount/"
        );
        setFeedbackCount(feedbackCountResponse.data);
      } catch (error) {
        console.error("Error fetching counts:", error.message);
      }
    };

    fetchCounts();

    // Update current date and time every second
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [history]);

  return (
    <Fragment>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="admin-content">
          <h1 style={{ marginLeft: "10px", marginTop: "10px" }}>
            Welcome, Admin!
          </h1>
          <p style={{ marginLeft: "10px", marginTop: "5px" }}>
            {currentDateTime}
          </p>
          <div className="admin-cards">
            <div className="admin-card card-recipes">
              <Link to="/admin/recipes" className="card-link">
                <div className="card-content">
                  <div className="card-text">
                    <h3>All Recipes</h3>
                    <p className="card-number">{recipeCount}</p>
                    <Link to="/admin/recipes" className="more-info">
                      More info{" "}
                      <FontAwesomeIcon icon="fa-solid fa-arrow-circle-right" />
                    </Link>
                  </div>
                  <FontAwesomeIcon
                    icon={faUtensils}
                    size="6x"
                    className="card-icon"
                  />
                </div>
              </Link>
            </div>
            <div className="admin-card card-users">
              <Link to="/admin/users" className="card-link">
                <div className="card-content">
                  <div className="card-text">
                    <h3>All Users</h3>
                    <p className="card-number">{userCount}</p>
                    <Link to="/admin/users" className="more-info">
                      More info{" "}
                      <FontAwesomeIcon icon="fa-solid fa-arrow-circle-right" />
                    </Link>
                  </div>
                  <FontAwesomeIcon
                    icon={faUsers}
                    size="6x"
                    className="card-icon"
                  />
                </div>
              </Link>
            </div>
            <div className="admin-card card-feedbacks">
              <Link to="/admin/feedbacks" className="card-link">
                <div className="card-content">
                  <div className="card-text">
                    <h3>All Feedbacks</h3>
                    <p className="card-number">{feedbackCount}</p>
                    <Link to="/admin/feedbacks" className="more-info">
                      More info{" "}
                      <FontAwesomeIcon icon="fa-solid fa-arrow-circle-right" />
                    </Link>
                  </div>
                  <FontAwesomeIcon
                    icon={faComments}
                    size="6x"
                    className="card-icon"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
