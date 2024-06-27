import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-elastic-carousel";
import RecipeCard from "../../components/recipeCard/RecipeCard";
import "../../styles/UserHistory.css";

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 3 },
  { width: 768, itemsToShow: 4 },
  { width: 1200, itemsToShow: 5 },
];

const UserHistory = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRecipes, setVisibleRecipes] = useState(4);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/recipe/newrecipes/"
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setRecipes(response.data);
        } else {
          setRecipes([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRemoveRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:8000/recipe/remove/${recipeId}`);
      setRecipes(recipes.filter((recipe) => recipe.recipeid !== recipeId));
    } catch (error) {
      console.error("Error removing recipe:", error);
    }
  };

  const handleRemoveAll = async () => {
    try {
      await axios.delete("http://localhost:8000/recipe/removeall");
      setRecipes([]);
    } catch (error) {
      console.error("Error removing all recipes:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleRecipes((prevVisibleRecipes) => prevVisibleRecipes + 4);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="history-main">
      <div className="history-heading">
        History
        <button className="remove-all-button" onClick={handleRemoveAll}>
          Remove All History
        </button>
      </div>
      <div className="recipe-carousel-container">
        {recipes.length > 0 ? (
          <Carousel breakPoints={breakPoints}>
            {recipes.slice(0, visibleRecipes).map((recipe) => (
              <RecipeCard
                key={recipe.recipeid}
                recipe={recipe}
                onRemove={() => handleRemoveRecipe(recipe.recipeid)}
                className="recipe-card"
              />
            ))}
          </Carousel>
        ) : (
          <div className="empty-message">No recipes in history.</div>
        )}
      </div>
      {visibleRecipes < recipes.length && (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default UserHistory;
