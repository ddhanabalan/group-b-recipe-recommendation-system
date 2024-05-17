import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
import "../../styles/ReviewsList.css";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    console.log("current page value:", currentPage);

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/recipe/allreviewslimited/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ page: currentPage }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        "http://localhost:8000/recipe/deletereview/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: reviewId }), // Pass the review ID as JSON in the request body
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete review");
      }
      // Remove the deleted review from the local state
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="reviewslist-content">
          <h2>All Reviews</h2>
          <table>
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Recipe ID</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Review</th>
                <th>Review Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.recipeid}</td>
                  <td>{review.userid}</td>
                  <td>{review.username}</td>
                  <td>{review.review}</td>
                  <td>{review.review_date}</td>
                  <td>
                    <button onClick={() => handleDeleteReview(review.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
