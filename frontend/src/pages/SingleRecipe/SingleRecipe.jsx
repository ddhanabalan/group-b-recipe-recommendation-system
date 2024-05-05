import React, { useContext, useState } from "react";
import "../../styles/RecipeDisplay.css";
import { RecipeContext } from "../../context/recipeContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../../utils/auth";

const RecipeDisplay = ({ recipe }) => {
  const { saveRecipe, isRecipeSaved } = useContext(RecipeContext);
  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.recipeid));

  if (!recipe) {
    return <div>Loading...</div>;
  }

  // Parse ingredients text into an array
  const ingredientsArray = recipe.ingredients.split("\n").filter((ingredient) => ingredient.trim() !== "");
  
  const ingredientList = ingredientsArray.map((ingredient, index) => (
    <li key={index} style={{ paddingBottom: 5 }}>
      {ingredient}
    </li>
  ));

  const handleSaveRecipe = async () => {
    try {
      // Assuming you have access to user ID and recipe ID
      const userId = userId(); // Implement this function to get the user ID
      const recipeId = recipe.recipeid;

      // Prepare the request body
      const requestBody = JSON.stringify({ userId, recipeId });

      // Send a POST request using fetch
      const response = await fetch("http://127.0.0.1:8000/recipe/saveRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }

      // Handle the response from the API as needed
      const responseData = await response.json();
      console.log("Save Recipe Response:", responseData);

      // Update state to indicate that the recipe is saved
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving recipe:", error);
      // Handle any errors that occur during the save process
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
            <b>{recipe.total_mins}</b> mins
          </span>
          <span className="calorie">
            <b>{recipe.calories}</b> calorie
          </span>
          <span className="review">
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
