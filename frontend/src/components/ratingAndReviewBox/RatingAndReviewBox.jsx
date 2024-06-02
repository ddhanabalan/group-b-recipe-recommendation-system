import React, { useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import "../../styles/RatingAndReviewBox.css";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  getUserId,
  getUserName,
  getAuthToken,
  clearAuthData,
} from "../../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
    const history = useNavigate;

    try {
      const userId = getUserId();
      const userName = getUserName();
      const authToken = getAuthToken();

      if (!userId || !userName || !reviewText || !currentValue) {
        console.error("Missing required fields");
        return;
      }

      const reviewData = {
        userid: userId,
        username: userName,
        recipeid: recipeId,
        review: reviewText,
        rating: currentValue,
      };

      const response = await axios.post(
        "http://localhost:8000/recipe/addreview/",
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setCurrentValue(0);
      setReviewText("");
    } catch (error) {
      console.error("Error posting review:", error.message);
      if (error.response) {
        if (error.response.status === 401) {
          clearAuthData();
          window.location.href = "/login";
        } else {
          console.error("Server responded with status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
      }
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
        <div className="ratingContainer-star">
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
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
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
