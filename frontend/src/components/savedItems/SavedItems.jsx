import React, { useContext, useEffect, useState } from "react";
import Items from "../Items/Items";
import { RecipeContext } from "../../context/recipeContext";
import "../../styles/SavedItems.css";
import { getUserId } from "../../utils/auth";

const SavedItems = () => {
  const { allRecipes, unsaveRecipe, isRecipeSaved } = useContext(RecipeContext);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        // Get userId from API
        const userId = getUserId();
        console.log("User ID in saveditems:", userId);

        // Fetch saved recipes for the user
        const response = await fetch("http://localhost:8000/recipe/saved/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: userId,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch saved recipes");
        }

        const data = await response.json();
        console.log("Saved recipes data:", data); // Log fetched data
        setSavedRecipes(data.savedRecipes);
      } catch (error) {
        console.error("Error fetching saved recipes:", error.message);
      }
    };

    fetchSavedRecipes();
  }, []);

  const handleRemoveRecipe = (recipeId) => {
    unsaveRecipe(recipeId);
  };

  return (
    <div className="saveditems">
      <hr />
      <div>
        <div className="saveditems-format">
          {savedRecipes && savedRecipes.length > 0 ? (
            <div className="saveditems-format">
              {savedRecipes.map((item, i) => (
                <div className="saved-recipe-card" key={i}>
                  <Items
                    id={item.recipeid}
                    title={item.title}
                    imageurl={item.img}
                    total_mins={item.total_mins}
                    calorie={item.calories}
                    ratings={item.rating}
                  />
                  <button onClick={() => handleRemoveRecipe(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedItems;
