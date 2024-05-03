import React from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
const UsersList = () => {
  return (
    <div>
      <Navbar />
      <AdminSideBar />
      <div className="userslist-content">users List</div>
    </div>
  );
};

export default UsersList;
