import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faUsers,
  faComments,
  faUserPlus,
  faPlus,
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
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [newRecipesCount, setNewRecipesCount] = useState(0);
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
          "http://localhost:8000/recipe/recipescount/"
        );
        setRecipeCount(recipeCountResponse.data);

        const userCountResponse = await axios.get(
          "http://localhost:8000/authentication/userscount/"
        );
        setUserCount(userCountResponse.data);

        const feedbackCountResponse = await axios.get(
          "http://localhost:8000/authentication/feedbackcount/"
        );
        setFeedbackCount(feedbackCountResponse.data);

        const newUsersCountResponse = await axios.get(
          "http://localhost:8000/authentication/newuserscount/"
        );
        setNewUsersCount(newUsersCountResponse.data);

        const newRecipesCountResponse = await axios.get(
          "http://localhost:8000/recipe/newrecipescount/"
        );
        setNewRecipesCount(newRecipesCountResponse.data);
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
            <div className="admin-card card-new-users">
              <Link to="/admin/newusers" className="card-link">
                <div className="card-content">
                  <div className="card-text">
                    <h3>New Users (30 Days)</h3>
                    <p className="card-number">{newUsersCount}</p>
                  </div>
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    size="6x"
                    className="card-icon"
                  />
                </div>
              </Link>
            </div>
            <div className="admin-card card-new-recipes">
              <Link to="/admin/newrecipes" className="card-link">
                <div className="card-content">
                  <div className="card-text">
                    <h3>New Recipes (30 Days)</h3>
                    <p className="card-number">{newRecipesCount}</p>
                  </div>
                  <FontAwesomeIcon
                    icon={faPlus}
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

{
  /*import React, { Fragment, useState, useEffect } from "react";
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
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Admin = () => {
  const [recipeCount, setRecipeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [newRecipesCount, setNewRecipesCount] = useState(0);
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
          "http://localhost:8000/recipe/recipescount/"
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

        const newUsersCountResponse = await axios.get(
          "http://localhost:8000/authentication/newuserscount"
        );
        setNewUsersCount(newUsersCountResponse.data);

        const newRecipesCountResponse = await axios.get(
          "http://localhost:8000/recipe/newrecipescount"
        );
        setNewRecipesCount(newRecipesCountResponse.data);
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

  const data = {
    labels: ["New Users", "New Recipes"],
    datasets: [
      {
        label: "Last 30 Days",
        data: [newUsersCount, newRecipesCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          precision: 0,
        },
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  };

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
          <div
            className="admin-graph"
            style={{ margin: "20px", height: "300px", width: "500px" }}
          >
            <h3 style={{ marginLeft: "10px" }}>Activity in the Last 30 Days</h3>
            <div style={{ height: "250px" }}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
*/
}
