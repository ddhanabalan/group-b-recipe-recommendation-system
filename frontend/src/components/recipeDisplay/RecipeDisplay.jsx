import React from "react";
import "../../styles/RecipeDisplay.css";

const RecipeDisplay = (props) => {
  const { recipe } = props;
  const ingredientList = recipe.ingredients.map((number) => {
    return <li style={{ paddingBottom: 5 }}>{number}</li>;
  });
  return (
    <div className="recipedisplay">
      <div className="recipedisplay-left">
        <div className="recipedisplay-img">
          <img src={recipe.imageurl} alt="recipe-pic" />
        </div>
        <h1>{recipe.title}</h1>
        <div className="recipedisplay-details">
          <span className="mins">
            {" "}
            <b>{recipe.total_mins}</b> mins
          </span>
          <span className="calorie">
            {" "}
            <b>{recipe.calorie}</b> calorie
          </span>
          <span className="review">
            {" "}
            <b>{recipe.reviews}</b> reviews
          </span>
        </div>
        <div className="recipe-ingredients">
          <div className="ingredient-heading">
            <h2>Ingredients:</h2>
            <div className="ingredient-btns">
              <button className="save_recipe">SAVE RECIPE</button>
              <button className="share">SHARE</button>
            </div>
          </div>
          <ul>{ingredientList}</ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
