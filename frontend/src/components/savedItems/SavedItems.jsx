import React, { useContext } from "react";
import Items from "../Items/Items";
import { RecipeContext } from "../../context/recipeContext";
import "../../styles/SavedItems.css";
const SavedItems = () => {
  const { all_recipe, unsaveRecipe, isRecipeSaved } = useContext(RecipeContext);
  console.log("isRecipesaved", isRecipeSaved);

  const savedRecipes = all_recipe
    ? all_recipe.filter((recipe) => isRecipeSaved(recipe.id))
    : null;
  console.log("savedRecipes", savedRecipes);
  const handleRemoveRecipe = (recipeId) => {
    unsaveRecipe(recipeId);
  };
  return (
    <div className="saveditems">
      <hr />
      <div>
        <div className="saveditems-format">
          {savedRecipes.map((item, i) => (
            <div className="saved-recipe-card">
              <Items
                key={i}
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
      </div>
    </div>
  );
};

export default SavedItems;
