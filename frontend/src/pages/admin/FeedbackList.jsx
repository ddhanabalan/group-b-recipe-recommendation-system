import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import { clearAuthToken, getAuthToken } from "../../utils/auth";
import { isAuthenticated, getUserRole } from "../../utils/auth";
import "../../styles/FeedbackList.css";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputPageNo, setInputPageNo] = useState("");
  const history = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== "admin") {
      history("/login");
      return;
    }
    fetchData(pageNo);
  }, [pageNo, history]);

  useEffect(() => {
    // Filter feedbacks based on search query
    const filtered = feedbacks.filter((feedback) =>
      feedback.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
  }, [feedbacks, searchQuery]);

  const fetchData = async (pageNumber) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/authentication/allfeedbacklimited/",
        { page: pageNumber }
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (e) => {
    setInputPageNo(e.target.value);
  };

  const handleSubmitPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPageNo);
    if (!isNaN(pageNumber) && pageNumber >= 1) {
      setPageNo(pageNumber);
    }
    setInputPageNo("");
  };

  const handleRemoveFeedback = async (id) => {
    const authToken = getAuthToken();
    try {
      await axios.delete(
        "http://localhost:8000/authentication/deletefeedback/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: {
            id: id,
          },
        }
      );
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthToken();
        history("/login");
      } else {
        console.error("Error removing feedback:", error);
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="feedbacklist-content">
          <h2
            style={{ marginBottom: 20, display: "flex", alignItems: "center" }}
          >
            All Feedbacks
            <div className="page-number-input" style={{ marginLeft: "auto" }}>
              <form
                onSubmit={handleSubmitPage}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={inputPageNo}
                  onChange={handlePageChange}
                  placeholder="No"
                  min="1"
                  className="page-input"
                  style={{ width: "50px", marginRight: "5px" }}
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
          </h2>
          <div className="feedback-actions">
            <input
              type="text"
              placeholder="Search by category..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <table className="feedback-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Category</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback, index) => (
                <tr
                  key={index}
                  className={
                    feedback.category === "complaint" ? "highlighted-row" : ""
                  }
                >
                  <td>{feedback.userid}</td>
                  <td>{feedback.category}</td>
                  <td style={{ width: 700 }}>{feedback.feedback}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFeedback(feedback.id)}
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
              style={{ backgroundColor: " #e19660", border: "1px solid #ccc" }}
            >
              Prev
            </button>
            <span>{pageNo}</span>
            <button
              onClick={handleNextPage}
              style={{ backgroundColor: " #e19660", border: "1px solid #ccc" }}
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

export default FeedbackList;
