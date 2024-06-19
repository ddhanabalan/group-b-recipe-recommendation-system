import React, { createContext, useState, useEffect } from "react";

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const initialCategories = [
    "Side Dish",
    "World Cuisine",
    "Meat and Poultry",
    "Appetizers and Snacks",
    "Main Dish",
    "Sauces and Condiments",
    "Desserts",
    "Beverages",
    "European",
    "Soups, Stews and Chili",
    "Seafood",
    "Bread",
    "Chicken",
    "Sauces",
    "Italian",
    "Pork",
    "Vegetables",
    "Soup",
    "Breakfast and Brunch",
    "Yeast Bread",
    "Salad",
    "Asian",
    "Dips and Spreads",
    "Potatoes",
    "Beef",
    "Quick Bread",
    "Fruit Desserts",
    "Eggs",
    "Lamb",
    "Vegetable Soup",
    "Stews",
    "Fish",
    "Steaks",
    "Latin American",
    "Everyday Cooking",
    "Shellfish",
    "French",
    "Cheese Dips and Spreads",
    "Chicken Breasts",
    "Pies",
    "Squash",
    "Salmon",
    "Mexican",
    "Pasta",
    "Cookies",
    "Whole Chicken",
    "Rice",
    "Shrimp",
    "Ground",
    "Canapes and Crostini",
    "Turkey",
  ];

  const [distinctCategories, setDistinctCategories] =
    useState(initialCategories);
  const [allRecipes, setAllRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [distinctSeasons, setDistinctSeasons] = useState([]);
  const [distinctDayOfTimeCooking] = useState([
    "All",
    "Breakfast",
    "Dinner",
    "Lunch",
    "Brunch",
  ]);
  const [distinctVegNonVeg] = useState(["Non-veg", "Veg"]);

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
      const seasonsSet = new Set();

      allRecipes.forEach((recipe) => {
        if (recipe.season) {
          recipe.season
            .split("/")
            .forEach((season) => seasonsSet.add(season.trim()));
        }
      });

      setDistinctSeasons(Array.from(seasonsSet));
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
