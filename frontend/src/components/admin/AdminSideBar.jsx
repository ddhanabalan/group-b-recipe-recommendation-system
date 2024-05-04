import React from "react";
import { Link } from "react-router-dom";
import "../../styles/SideBar.css";
const AdminSideBar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/users">Users</Link>
        </li>
        <li>
          <Link to="/admin/recipes">Recipes</Link>
        </li>
        <li>
          <Link to="/admin/feedbacks">Feedbacks</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSideBar;
