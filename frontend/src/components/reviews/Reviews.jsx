import React from "react";
import ReviewElement from "./ReviewElement";
import "../../styles/Reviews.css";
const Reviews = ({ reviews }) => {
  const renderReviews = () => {
    if (!reviews || reviews.length === 0) {
      return <div>No reviews available.</div>;
    }

    return reviews.map((review) => (
      <li key={review.id}>
        <ReviewElement
          id={review.id}
          date={review.date}
          username={review.username}
          review={review.review}
          stars={review.stars}
        />
      </li>
    ));
  };

  return (
    <div className="user-reviews">
      <div className="review-container">
        <ul>{renderReviews()}</ul>
      </div>
    </div>
  );
};

export default Reviews;
