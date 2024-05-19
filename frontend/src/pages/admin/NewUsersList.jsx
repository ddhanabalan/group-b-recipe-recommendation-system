import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import { clearAuthToken, getAuthToken } from "../../utils/auth";
import { isAuthenticated, getUserRole } from "../../utils/auth";
import "../../styles/UsersList.css";

const NewUsersList = () => {
  const [users, setUsers] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [inputPageNo, setInputPageNo] = useState("");
  const [totalUsers, setTotalUsers] = useState(0); // State to store total number of users
  const history = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== "admin") {
      history("/login");
      return;
    }
    fetchData(pageNo);
    fetchTotalUsers(); // Fetch total number of users when component mounts
  }, [pageNo, history]);

  const fetchData = async (pageNumber) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/authentication/newusersdetails/",
        { page: pageNumber }
      );
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/authentication/newuserscount"
      );
      setTotalUsers(response.data || 0);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePageChange = (e) => {
    setInputPageNo(e.target.value);
  };

  const handleSubmitPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPageNo);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalUsers / 50)
    ) {
      setPageNo(pageNumber);
    }
    setInputPageNo("");
  };

  const handleRemoveUser = async (userid) => {
    try {
      const authToken = getAuthToken();
      await axios.delete("http://localhost:8000/authentication/deleteuser/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          userid: userid,
        },
      });
      setUsers(users.filter((user) => user.userid !== userid));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthToken();
        history("/login");
      } else {
        console.error("Error removing user:", error);
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="userslist-content">
          <h2 style={{ marginBottom: 10 }}>All Users</h2>
          <p>Total Users: {totalUsers}</p>
          <div className="pagination-input-container">
            <form onSubmit={handleSubmitPage} className="pagination-input-form">
              <input
                type="number"
                value={inputPageNo}
                onChange={handlePageChange}
                placeholder="Enter page number"
                className="pagination-input-field"
                min="1"
                max={Math.ceil(totalUsers / 50)}
                onKeyDown={(e) => {
                  if (e.code === "Minus" || e.key === "-" || e.key === ".") {
                    e.preventDefault();
                  }
                }}
              />
              <button type="submit" className="pagination-input-button">
                Go
              </button>
            </form>
          </div>

          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.userid}</td>
                  <td>{user.username}</td>
                  <td>{user.email || "Not available"}</td>
                  <td>
                    {moment(user.created_at).format("MM/DD/YYYY, hh:mm:ss A")}
                  </td>{" "}
                  <td>
                    <button
                      onClick={() => handleRemoveUser(user.userid)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              style={{ backgroundColor: "#e19660", border: "1px solid #ccc" }}
            >
              Prev
            </button>
            <span>
              {pageNo} of {Math.ceil(totalUsers / 50)}
            </span>
            <button
              onClick={handleNextPage}
              style={{ backgroundColor: "#e19660", border: "1px solid #ccc" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewUsersList;
