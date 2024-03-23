import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Reviews.css";
import { UserReviewContext } from "../../context/userReviewContext";
import ReviewElement from "./ReviewElement";
const Reviews = () => {
  const { value } = useContext(UserReviewContext);
  //console.log("data:", value);
  const { RecipeId } = useParams();
  const recipeId = Number(RecipeId);
  //console.log("elementid:", RecipeId);

  const recipe = value.filter((e) => {
    //console.log("e.id", e.id, typeof e.id);
    //console.log("recipeId", recipeId, typeof recipeId);
    return e.id === recipeId;
  });
  //console.log("user:", recipe);

  const usersList = recipe.map((item, i) => {
    return (
      <li style={{ listStyleType: "none" }}>
        <ReviewElement
          key={i}
          id={item.id}
          date={item.date}
          username={item.username}
          review={item.review}
          stars={item.ratings}
        />
      </li>
    );
  });
  return (
    <div className="user-reviews">
      <div className="review-container">
        <ul>{usersList}</ul>
      </div>
    </div>
  );
};

export default Reviews;
