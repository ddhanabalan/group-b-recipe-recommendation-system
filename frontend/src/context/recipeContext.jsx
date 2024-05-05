import React, { createContext, useState, useEffect } from "react";

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/recipe/allrecipes");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAllRecipes(data);
        setLoading(false);
        console.log("All Recipes:", data);
    
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);
  useEffect(() => {
    console.log("All Recipes:", allRecipes);
    if (!loading && allRecipes) {
      // Check if allRecipes is not undefined
      const categoriesSet = new Set();
      allRecipes.forEach((recipe) => {
        if (recipe.category) {
          // Check if recipe.category is not undefined
          recipe.category.forEach((cat) => categoriesSet.add(cat));
        }
      });
      const categoriesArray = Array.from(categoriesSet);
      setDistinctCategories(categoriesArray);
    }
  }, [allRecipes, loading]);

  const saveRecipe = (recipeId) => {
    if (!savedRecipes.includes(recipeId)) {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  const unsaveRecipe = (recipeId) => {
    setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
  };

  const isRecipeSaved = (recipeId) => {
    return savedRecipes.includes(recipeId);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show an error message if data fetching fails
  }

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

export { RecipeContext, RecipeContextProvider };
