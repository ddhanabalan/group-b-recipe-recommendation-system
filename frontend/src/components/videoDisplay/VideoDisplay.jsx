import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/VideoDisplay.css";
import { FaTimes } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import axios from "axios";
import {
  clearAuthData,
  getAuthToken,
  refreshAccessToken,
  setAuthToken,
} from "../../utils/auth";

const VideoDisplay = ({ recipe }) => {
  const [userMadeRecipe, setUserMadeRecipe] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const history = useNavigate();
  const handleFeedback = async (value) => {
    setUserMadeRecipe(value);
    console.log(`User made recipe: ${value ? "Yes" : "No"}`);

    if (value) {
      try {
        let authToken = getAuthToken();

        if (!authToken) {
          authToken = await refreshAccessToken();
        }

        const response = await axios.post(
          "http://localhost:8000/recipe/maderecipe/",
          {
            recipeid: recipe.recipeid,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
            },
          }
        );
        console.log("API response:", response.data);
      } catch (error) {
        console.error("Error sending feedback to API:", error);
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized error:", error);
          await handleUnauthorizedError();
        }
      }
    }
  };
  const handleUnauthorizedError = async () => {
    try {
      const { refresh: refreshToken } = getAuthToken();
      const response = await axios.post(
        "http://localhost:8000/authentication/token/refresh/",
        { refresh: refreshToken }
      );
      const { access, refresh } = response.data;
      setAuthToken({ access, refresh });
      await handleFeedback(); // Retry submitting after token refresh
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData(); // Clear auth data on token refresh failure
      history("/login");
    }
  };

  const toggleVideoPopup = () => {
    setShowVideoPopup(!showVideoPopup);
  };

  const isVideoAvailable = recipe.video && recipe.thumbnail;

  return (
    <div className="video-container">
      <div className="horizontal-line"></div>

      {isVideoAvailable ? (
        <>
          <div className="video-thumbnail" onClick={toggleVideoPopup}>
            <div className="video-img">
              <img src={recipe.thumbnail} alt="Recipe Video Thumbnail" />
            </div>
            <div className="video-heading">
              <h1>Master Your Recipes with Videos</h1>
            </div>
          </div>

          {/* Video popup */}
          {showVideoPopup && (
            <div className="video-popup">
              <FaTimes className="close-icon" onClick={toggleVideoPopup} />
              <video controls width="560" height="315">
                <source src={recipe.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      ) : (
        <div className="video-heading">
          <h1
            style={{ fontSize: "18px", marginTop: "-33px", marginRight: "5px" }}
          >
            No Video Available
          </h1>
        </div>
      )}

      <div className="horizontal-line"></div>

      {/* Question and icons */}
      <div className="user-feedback">
        <h3 style={{ marginRight: "5px", marginLeft: "30px" }}>
          Did you make this ?
        </h3>
        <button
          onClick={() => handleFeedback(true)}
          style={{ color: userMadeRecipe === true ? " #4CAF50" : "#9b9999" }}
        >
          <FaRegCheckCircle className="thumb-icon" />
        </button>
      </div>
      <div className="horizontal-line"></div>
    </div>
  );
};

export default VideoDisplay;
