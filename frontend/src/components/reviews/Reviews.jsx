import React from "react";
import ReviewElement from "./ReviewElement";
import "../../styles/Reviews.css";

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="user-reviews">
      <div className="review-container">
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewElement
                id={review.id}
                date={review.date}
                username={review.username}
                review={review.review}
                stars={review.rating}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reviews;
