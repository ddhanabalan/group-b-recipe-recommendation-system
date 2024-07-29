import React, { useContext, useState, useEffect } from "react";
import "../../styles/RecipeDisplay.css";
import { useNavigate } from "react-router-dom";
import { RecipeContext } from "../../context/recipeContext";
import { Link } from "react-router-dom";
import {
  clearAuthData,
  getAuthToken,
  getUserId,
  isAuthenticated,
  refreshAccessToken,
  setAuthToken,
} from "../../utils/auth";
import axios from "axios";
import Swal from "sweetalert2";
import loadingGif from "../../assets/loading.gif";

const RecipeDisplay = (props) => {
  const { recipe } = props;
  const { saveRecipe, isRecipeSaved } = useContext(RecipeContext);
  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.id));
  const history = useNavigate();
  useEffect(() => {
    setIsSaved(isRecipeSaved(recipe.recipeid));
  }, [isRecipeSaved, recipe.recipeid]);

  const handleSaveRecipe = async () => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    try {
      let authToken = getAuthToken();
      const userId = getUserId();

      if (!authToken) {
        authToken = await refreshAccessToken();
      }

      const response = await axios.post(
        "http://localhost:8000/recipe/saverecipe/",
        {
          userid: userId,
          recipeid: recipe.recipeid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );

      setIsSaved(true);
      //console.log("Recipe ID saved:", recipe.recipeid);
      //console.log("Save recipe response:", response.data);
    } catch (error) {
      console.error("Error saving recipe:", error);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized error:", error);
        await handleUnauthorizedError();
      } else {
        console.error(
          "An error occurred while saving the recipe:",
          error.message
        );

        // Show specific error message if recipe is already favorited
        if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Recipe already favorited"
        ) {
          Swal.fire({
            icon: "info",
            title: "Recipe Already Favorited",
            text: "You have already favorited this recipe.",
          });
        }
      }
    }
  };
  const handleUnauthorizedError = async () => {
    try {
      const { refresh: refreshToken } = getAuthToken();
      const response = await axios.post(
        "http://localhost:8000/authentication/token/refresh/",
        { refresh: refreshToken }
      );
      const { access, refresh } = response.data;
      setAuthToken({ access, refresh });
      await handleSaveRecipe(); // Retry submitting after token refresh
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData(); // Clear auth data on token refresh failure
      history("/login");
    }
  };
  if (!recipe) {
    return (
      <div className="loader">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  let ingredientsArray = [];
  if (typeof recipe.ingredients === "string") {
    ingredientsArray = recipe.ingredients
      .replace(/"/g, "")
      .replace(/\[|\]/g, "")
      .replace(/\['/g, "")
      .replace(/'\]/g, "")
      .replace(/\["/g, "")
      .replace(/"\]/g, "")
      .replace(/'/g, "")
      .split(/,\s*|\s+or\s+|,\s*/);
  } else if (Array.isArray(recipe.ingredients)) {
    ingredientsArray = recipe.ingredients;
  }

  const ingredientList = ingredientsArray.map((ingredient, index) => (
    <li key={index} style={{ paddingBottom: 5 }}>
      {ingredient}
    </li>
  ));

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
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#e49963";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#e8a97d";
                    }}
                  >
                    SAVED
                  </Link>
                </button>
              ) : (
                <button
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={handleSaveRecipe}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#e49963";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#e8a97d";
                  }}
                  className="save_recipe"
                >
                  SAVE RECIPE
                </button>
              )}

              <button
                onClick={handleShareRecipe}
                style={{
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#e49963";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#e8a97d";
                }}
                className="share"
              >
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
