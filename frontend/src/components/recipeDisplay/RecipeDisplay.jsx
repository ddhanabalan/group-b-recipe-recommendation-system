import React, { useContext, useState, useEffect } from "react";
import "../../styles/RecipeDisplay.css";
import { RecipeContext } from "../../context/recipeContext";
import { Link } from "react-router-dom";
import { getAuthToken, getUserId } from "../../utils/auth";
import axios from "axios";
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
    ingredientsArray = recipe.ingredients;
  }

  const ingredientList = ingredientsArray.map((ingredient, index) => (
    <li key={index} style={{ paddingBottom: 5 }}>
      {ingredient}
    </li>
  ));
  const handleSaveRecipe = async () => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        console.error("User not authenticated.");
        return;
      }

      const userId = getUserId();
      const response = await axios.post(
        "http://localhost:8000/recipe/saved/",
        {
          userid: userId,
          recipeid: recipe.recipeid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsSaved(true);
    } catch (error) {
      console.error("Error saving recipe:", error);
      if (error.response && error.response.status === 401) {
        console.error("Authentication failed. Redirecting to login page.");
      } else {
        console.error(
          "An error occurred while saving the recipe:",
          error.message
        );
      }
    }
  };

  const handleShareRecipe = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } else {
        throw new Error("Web Share API not supported.");
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
      // Fallback behavior if sharing fails or Web Share API is not supported
      alert(`Share ${recipe.title} using your preferred method.`);
    }
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
              <button onClick={handleShareRecipe} className="share">
                SHARE
              </button>
            </div>
          </div>
          <ul>{ingredientList}</ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
