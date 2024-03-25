import React from "react";
import "../../styles/ReviewElement.css";
import StarRating from "../starRating/StarRating";
import { FaRegCircleUser } from "react-icons/fa6";
const ReviewElement = (props) => {
  return (
    <div className="reviewelement">
      <div className="review-item">
        <div className="review-item-head">
          <div className="review-username" style={{ paddingRight: 20 }}>
            <FaRegCircleUser
              style={{
                fontSize: 25,
                paddingRight: 10,
              }}
            />
            <b style={{ fontSize: 20 }}>{props.username}</b>
          </div>
          <div
            className="review-date"
            style={{ paddingRight: 20, paddingTop: 9 }}
          >
            {props.date}
          </div>
          <div
            className="star-rating"
            style={{ paddingRight: 10, paddingTop: 5 }}
          >
            <StarRating stars={props.stars} />
          </div>
        </div>
        <div className="review-describtion" style={{ paddingTop: 10 }}>
          " {props.review} "
        </div>
      </div>
      <hr
        style={{
          marginTop: 30,
          marginBottom: 30,
          border: "none",
          borderBottom: "1px dotted #817e7e",
        }}
      />
    </div>
  );
};

export default ReviewElement;
