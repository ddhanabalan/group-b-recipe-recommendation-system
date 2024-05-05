import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faUsers,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";

import "../../styles/Admin.css";

const Admin = () => {
  const [recipeCount, setRecipeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  // Placeholder functions to fetch counts (replace with actual fetch logic)
  const fetchRecipeCount = async () => {
    // Placeholder logic to fetch recipe count
    return 50; // Placeholder value
  };

  const fetchUserCount = async () => {
    // Placeholder logic to fetch user count
    return 100; // Placeholder value
  };

  const fetchFeedbackCount = async () => {
    // Placeholder logic to fetch feedback count
    return 20; // Placeholder value
  };

  // Fetch counts using useEffect
  useEffect(() => {
    const fetchCounts = async () => {
      const recipeCountData = await fetchRecipeCount();
      setRecipeCount(recipeCountData);

      const userCountData = await fetchUserCount();
      setUserCount(userCountData);

      const feedbackCountData = await fetchFeedbackCount();
      setFeedbackCount(feedbackCountData);
    };

    fetchCounts();
  }, []); // Empty dependency array to fetch counts on initial render

  return (
    <Fragment>
      <Navbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="admin-content">
          <div className="admin-cards">
            <div className="admin-card">
              <Link to="/admin/recipes">
                <FontAwesomeIcon
                  icon={faUtensils}
                  size="2x"
                  style={{ color: "#e1792f" }}
                />
                <h3>All Recipes</h3>
                <p>{recipeCount}</p>
              </Link>
            </div>
            <div className="admin-card">
              <Link to="/admin/users">
                <FontAwesomeIcon
                  icon={faUsers}
                  size="2x"
                  style={{ color: "#e1792f" }}
                />
                <h3>All Users</h3>
                <p>{userCount}</p>
              </Link>
            </div>
            <div className="admin-card">
              <Link to="/admin/feedbacks">
                <FontAwesomeIcon
                  icon={faComments}
                  size="2x"
                  style={{ color: "#e1792f" }}
                />
                <h3>All Feedbacks</h3>
                <p>{feedbackCount}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
