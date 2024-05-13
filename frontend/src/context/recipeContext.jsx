import React, { createContext, useState, useEffect } from "react";

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [distinctSeasons, setDistinctSeasons] = useState([]);
  const [distinctDayOfTimeCooking, setDistinctDayOfTimeCooking] = useState([]);
  const [distinctVegNonVeg, setDistinctVegNonVeg] = useState([]);

  useEffect(() => {
    if (!dataLoaded) {
      const fetchRecipes = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/recipe/allrecipes"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setAllRecipes(data);
          setLoading(false);
          setDataLoaded(true);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchRecipes();
    }
  }, [dataLoaded]);

  useEffect(() => {
    if (!loading && allRecipes) {
      const categoriesSet = new Set();
      const seasonsSet = new Set();
      const dayOfTimeCookingSet = new Set();
      const vegNonVegSet = new Set();

      allRecipes.forEach((recipe) => {
        if (recipe.categories) {
          recipe.categories.forEach((cat) => categoriesSet.add(cat));
        }
        seasonsSet.add(recipe.season);
        dayOfTimeCookingSet.add(recipe.daytimeofcooking);
        vegNonVegSet.add(recipe.veg_nonveg);
      });

      setDistinctCategories(Array.from(categoriesSet));
      setDistinctSeasons(Array.from(seasonsSet));
      setDistinctDayOfTimeCooking(Array.from(dayOfTimeCookingSet));
      setDistinctVegNonVeg(Array.from(vegNonVegSet));
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <RecipeContext.Provider
      value={{
        allRecipes,
        distinctCategories,
        distinctSeasons,
        distinctDayOfTimeCooking,
        distinctVegNonVeg,
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
