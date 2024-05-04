import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
const Admin = () => {
  return (
    <Fragment>
      <Navbar />
      <AdminSideBar />
    </Fragment>
  );
};

export default Admin;
