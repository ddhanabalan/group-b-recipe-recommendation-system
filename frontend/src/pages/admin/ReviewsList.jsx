import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import { clearAuthToken, getAuthToken } from "../../utils/auth";
import { isAuthenticated, getUserRole } from "../../utils/auth";
import "../../styles/ReviewsList.css";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
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

  const fetchData = async (pageNumber) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/allreviewslimited/",
        { page: pageNumber }
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
    if (!isNaN(pageNumber) && pageNumber >= 1) {
      setPageNo(pageNumber);
    }
    setInputPageNo("");
  };

  const handleRemoveReview = async (id) => {
    const token = getAuthToken();
    try {
      await axios.delete("http://localhost:8000/recipe/deletereview", {
        data: { id: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(reviews.filter((review) => review.id !== id));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthToken();
        window.location.href = "/login";
      } else {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.recipeid.toString().includes(searchQuery)
  );

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="reviewslist-content">
          <h2
            style={{ marginBottom: 20, display: "flex", alignItems: "center" }}
          >
            All Reviews
            <div className="page-number-input" style={{ marginLeft: "auto" }}>
              <form
                onSubmit={handleSubmitPage}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={inputPageNo}
                  onChange={handlePageChange}
                  placeholder="No:"
                  min="1"
                  className="page-input"
                  style={{ width: "100px", marginRight: "5px" }}
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
          <div className="review-actions">
            <input
              type="text"
              placeholder="Search by username or recipe ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <table className="review-table">
            <thead>
              <tr>
                <th>Recipe ID</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review, index) => (
                <tr
                  key={index}
                  className={review.rating <= 2 ? "highlighted-row" : ""}
                >
                  <td>{review.recipeid}</td>
                  <td>{review.userid}</td>
                  <td>{review.username}</td>
                  <td style={{ width: 700 }}>{review.review}</td>
                  <td>{review.rating}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveReview(review.id)}
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
            <span>{pageNo}</span>
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

export default ReviewsList;
