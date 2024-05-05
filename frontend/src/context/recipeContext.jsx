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
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (!loading && allRecipes) {
      const categoriesSet = new Set();
      allRecipes.forEach((recipe) => {
        if (recipe.categories) {
          recipe.categories.forEach((cat) => categoriesSet.add(cat));
        }
      });
      const categoriesArray = Array.from(categoriesSet);
      setDistinctCategories(categoriesArray);
    }
  }, [allRecipes, loading]);

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
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export { RecipeContext, RecipeContextProvider };
