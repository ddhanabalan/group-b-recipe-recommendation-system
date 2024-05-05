import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Define RecipeContext outside of the component
const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch recipe data from the API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/recipe/allrecipes"
        );
        setAllRecipes(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Extract distinct categories from fetched recipes
  useEffect(() => {
    const categoriesSet = new Set();
    allRecipes.forEach((recipe) => {
      recipe.category.forEach((cat) => categoriesSet.add(cat));
    });
    const categoriesArray = Array.from(categoriesSet);
    setDistinctCategories(categoriesArray);
  }, [allRecipes]);

  // Save a recipe to savedRecipes state
  const saveRecipe = (recipeId) => {
    if (!savedRecipes.includes(recipeId)) {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  // Remove a recipe from savedRecipes state
  const unsaveRecipe = (recipeId) => {
    setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
  };

  // Check if a recipe is saved
  const isRecipeSaved = (recipeId) => {
    return savedRecipes.includes(recipeId);
  };

  return (
    <RecipeContext.Provider
      value={{
        allRecipes,
        distinctCategories,
        saveRecipe,
        unsaveRecipe,
        isRecipeSaved,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export { RecipeContext, RecipeContextProvider }; // Export RecipeContext and RecipeContextProvider
