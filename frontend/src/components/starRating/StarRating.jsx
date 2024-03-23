import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStarHalf } from "react-icons/md";
import "../../styles/StarRating.css";

const StarRating = ({ stars }) => {
  const ratingStar = Array.from({ length: 5 }, (_, index) => {
    const ratingValue = index + 1;
    return (
      <span key={index}>
        {stars >= ratingValue ? (
          <MdOutlineStar className="icon" />
        ) : stars >= ratingValue - 0.5 ? (
          <MdOutlineStarHalf className="icon" />
        ) : (
          <MdOutlineStarBorder className="icon" />
        )}
      </span>
    );
  });

  return (
    <div className="wrap">
      <div className="icon-style">{ratingStar}</div>
    </div>
  );
};

export default StarRating;
