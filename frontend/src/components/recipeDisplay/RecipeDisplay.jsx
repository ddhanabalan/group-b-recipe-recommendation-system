import React, { useContext, useState } from "react";
import "../../styles/RecipeDisplay.css";
import { RecipeContext } from "../../context/recipeContext";
import { Link } from "react-router-dom";

const RecipeDisplay = (props) => {
  const { recipe } = props;
  const { saveRecipe, isRecipeSaved } = useContext(RecipeContext);
  console.log("isRecipesaved", isRecipeSaved);
  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.id));
  const ingredientList = recipe.ingredients.map((number) => {
    return <li style={{ paddingBottom: 5 }}>{number}</li>;
  });
  const handleSaveRecipe = () => {
    saveRecipe(recipe.id);
    setIsSaved(true);
  };

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
