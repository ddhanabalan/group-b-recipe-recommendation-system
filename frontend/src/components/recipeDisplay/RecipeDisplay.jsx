import React, { useContext, useState } from "react";
import "../../styles/RecipeDisplay.css";
import { RecipeContext } from "../../context/recipeContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../../utils/auth";

const RecipeDisplay = (props) => {
  const { recipe } = props;
  const { saveRecipe, isRecipeSaved } = useContext(RecipeContext);

  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.id));
  if (!recipe) {
    return <div>Loading...</div>;
  }
  let ingredientsArray = [];
  if (typeof recipe.ingredients === "string") {
    ingredientsArray = recipe.ingredients
      .replace(/"/g, "")
      .replace(/\['/g, "")
      .replace(/'\]/g, "")
      .replace(/'/g, "")
      .split(", ");
  } else if (Array.isArray(recipe.ingredients)) {
    // Assuming recipe.ingredients is already an array
    ingredientsArray = recipe.ingredients;
  }

  const ingredientList = ingredientsArray.map((ingredient, index) => (
    <li key={index} style={{ paddingBottom: 5 }}>
      {ingredient}
    </li>
  ));
  const handleSaveRecipe = () => {
    saveRecipe(recipe.id);
    setIsSaved(true);
  };
  return (
    <div className="recipedisplay">
      <div className="recipedisplay-left">
        <div className="recipedisplay-img">
          <img src={recipe.img} alt="recipe-pic" />
        </div>
        <h1>{recipe.title}</h1>
        <div className="recipedisplay-details">
          <span className="mins">
            {" "}
            <b>{recipe.total_mins}</b> mins
          </span>
          <span className="calorie">
            {" "}
            <b>{recipe.calories}</b> calorie
          </span>
          <span className="review">
            {" "}
            <b>{recipe.total_reviews}</b> reviews
          </span>
        </div>
        <div className="recipe-ingredients">
          <div className="ingredient-heading">
            <h2>Ingredients:</h2>
            <div className="ingredient-btns">
              {isSaved ? (
                <button className="saved_recipe">
                  <Link
                    to={`/user/savedrecipes`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    SAVED
                  </Link>
                </button>
              ) : (
                <button onClick={handleSaveRecipe} className="save_recipe">
                  SAVE RECIPE
                </button>
              )}
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
