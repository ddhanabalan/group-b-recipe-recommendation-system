import React, { useState } from "react";
import "../../styles/VideoDisplay.css";
import { FaThumbsUp, FaThumbsDown, FaTimes } from "react-icons/fa"; // Importing thumb icons from react-icons

const VideoDisplay = ({ recipe }) => {
  const [userMadeRecipe, setUserMadeRecipe] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  const handleFeedback = (value) => {
    setUserMadeRecipe(value);
    console.log(`User made recipe: ${value ? "Yes" : "No"}`);
  };

  const toggleVideoPopup = () => {
    setShowVideoPopup(!showVideoPopup);
  };

  // Check if both video URL and thumbnail exist
  const isVideoAvailable = recipe.video && recipe.thumbnail;

  return (
    <div className="video-container">
      <div className="horizontal-line"></div>

      {/* Conditionally render video section */}
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
          <h1 style={{ fontSize: "16px" }}>No Video Available</h1>
        </div>
      )}

      <div className="horizontal-line"></div>

      {/* Question and icons */}
      <div className="user-feedback">
        <h3 style={{ marginRight: "10px" }}>Have you made this recipe?</h3>
        <button
          onClick={() => handleFeedback(true)}
          style={{ color: userMadeRecipe === true ? "#4CAF50" : "#000" }}
        >
          <FaThumbsUp className="thumb-icon" />
        </button>
        <button
          onClick={() => handleFeedback(false)}
          style={{ color: userMadeRecipe === false ? "#f44336" : "#000" }}
        >
          <FaThumbsDown className="thumb-icon" />
        </button>
      </div>
    </div>
  );
};

export default VideoDisplay;
