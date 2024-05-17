import React from "react";
import "../../styles/Items.css";

import StarRating from "../starRating/StarRating";
import { Link } from "react-router-dom";
import { getUserId, isAuthenticated } from "../../utils/auth";

const Items = (props) => {
  const handleClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "auto" });

    if (isAuthenticated()) {
      const userId = getUserId();
      const recipeId = props.recipeid;
      console.log("userid:", userId);
      console.log("recipeid :", recipeId);
      const data = { userId, recipeId };

      // Send data to the API
      fetch("http://localhost:8000/recipe/userhistory/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // Handle response if needed
          console.log("API request successful");
        })
        .catch((error) => {
          console.error("Error sending data to API:", error);
        });
    }
  };

  const formatDecimal = (number) => {
    return Number(number).toFixed(1);
  };

  return (
    <div className="item" onClick={handleClick}>
      <Link
        to={`/singlerecipe/${props.recipeid}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <img src={props.img} alt="recipe" className="img" />

        <h3>{props.title}</h3>
        <div className="items-details">
          <div className="mins">
            <b>{props.total_mins}</b> mins
          </div>
          <div className="calories" style={{ paddingTop: 3 }}>
            <b>{props.calories}</b> Calorie
          </div>
        </div>
        <div className="item-rating">
          <b style={{ paddingTop: 2.5, paddingRight: 5 }}>
            {formatDecimal(props.rating)}
          </b>
          <StarRating stars={props.rating} />
        </div>
      </Link>
    </div>
  );
};

export default Items;
