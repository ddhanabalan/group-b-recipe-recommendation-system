import React, { useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import "../../styles/RatingAndReviewBox.css";
import { FaRegCircleUser } from "react-icons/fa6";
import { getUserId } from "../../utils/auth";
import axios from "axios";
const colors = {
  orange: "rgb(255, 174, 0)",
  grey: "#a9a9a9",
};

const RatingAndReviewBox = (props) => {
  const { recipeId } = props;
  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [reviewText, setReviewText] = useState("");
  const handleClick = (value) => {
    setCurrentValue(value);
  };

  const handleMouseOver = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handlePostReview = async () => {
    try {
      const userId = getUserId();
      const reviewData = {
        userid: userId,
        recipeid: recipeId,
        review: reviewText,
      };
      console.log("Data sending to API:", reviewData);
      const response = await axios.post(
        "http://localhost:8000/recipe/addreview/",
        reviewData, // Ensure review data is correct
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Review posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting review:", error.message);
    }
  };

  return (
    <div className="ratingContainer">
      <div className="ratingContainer_review">
        <FaRegCircleUser style={{ fontSize: 25 }} />
        <textarea
          placeholder="What's your feedback?"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
      <div className="ratingContainer-bottom">
        {/*} <div className="ratingContainer-star">
          Your Rating :
          {stars.map((_, index) => {
            return (
              <MdOutlineStar
                key={index}
                size={20}
                style={{
                  cursor: "pointer",
                  marginLeft: 2,
                }}
                color={
                  (hoverValue || currentValue) > index
                    ? colors.orange
                    : colors.grey
                }
                onClick={() => handleClick(index + 1)}
                onMouseOver={() => handleClick(index + 1)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>*/}
        <button
          style={{
            borderRadius: 15,
            borderWidth: 0.01,
            borderColor: "#858282",
            width: 110,
            height: 30,
            fontWeight: 500,
            backgroundColor: "#c9c7c7",
          }}
          onClick={handlePostReview}
        >
          Post Review
        </button>
      </div>
      <hr
        style={{
          marginTop: 30,
          marginBottom: 30,
          border: "none",
          borderBottom: "1px dotted #9b9999",
        }}
      />
    </div>
  );
};

export default RatingAndReviewBox;
