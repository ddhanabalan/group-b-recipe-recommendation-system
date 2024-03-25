import React, { useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import "../../styles/RatingAndReviewBox.css";
import { FaRegCircleUser } from "react-icons/fa6";
const colors = {
  orange: "rgb(255, 174, 0)",
  grey: "#a9a9a9",
};

const RatingAndReviewBox = () => {
  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);

  const handleClick = (value) => {
    setCurrentValue(value);
  };

  const handleMouseOver = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="ratingContainer">
      <div className="ratingContainer_review">
        <FaRegCircleUser style={{ fontSize: 25 }} />
        <textarea placeholder="What's your feedback?" />
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
                onMouseOver={() => handleClick(index + 1)}
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
