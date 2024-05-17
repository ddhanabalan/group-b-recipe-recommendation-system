import React from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
const ReviewsList = () => {
  return (
    <div>
      <Navbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="reviewslist-content">hello</div>
      </div>
    </div>
  );
};

export default ReviewsList;

{
  /*import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
import "../../styles/ReviewsList.css";
const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/recipe/allreviews/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
        console.log("all reviews :", data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/recipe/deletereview/`
      );
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      // Remove the deleted review from the local state
      setReviews(reviews.filter((review) => review.review_id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
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
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
*/
}
