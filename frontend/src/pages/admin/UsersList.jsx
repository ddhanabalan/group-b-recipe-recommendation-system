import React from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
const UsersList = () => {
  return (
    <div>
      <Navbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="userslist-content">hello</div>
      </div>
    </div>
  );
};

export default UsersList;
