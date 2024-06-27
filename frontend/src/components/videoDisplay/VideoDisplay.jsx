import React, { useState } from "react";
import "../../styles/VideoDisplay.css";
import { FaThumbsUp, FaThumbsDown, FaTimes } from "react-icons/fa"; // Importing thumb icons from react-icons
import recipeVideoThumbnail from "../../assets/thumpnail.jpg";

const VideoDisplay = () => {
  const [userMadeRecipe, setUserMadeRecipe] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  const handleFeedback = (value) => {
    setUserMadeRecipe(value);
    console.log(`User made recipe: ${value ? "Yes" : "No"}`);
  };

  const toggleVideoPopup = () => {
    setShowVideoPopup(!showVideoPopup);
  };

  return (
    <div className="video-container">
      {/* Video thumbnail and heading */}
      <div className="horizontal-line"></div>

      <div className="video-thumbnail" onClick={toggleVideoPopup}>
        <div className="video-img">
          <img src={recipeVideoThumbnail} alt="Recipe Video Thumbnail" />
        </div>
        <div className="video-heading">
          <h1>Master Your Recipes with Videos</h1>
        </div>
      </div>

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

      <div className="horizontal-line"></div>

      {/* Video popup */}
      {showVideoPopup && (
        <div className="video-popup">
          <FaTimes className="close-icon" onClick={toggleVideoPopup} />
          <iframe
            title="Recipe Video"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/VIDEO_ID_HERE"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
