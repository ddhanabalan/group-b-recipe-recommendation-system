import React, { useState } from "react";
import axios from "axios";
import RecipeCard from "../../components/recipeCard/RecipeCard";
import "../../styles/UserHistory.css";
import { getAuthToken, getUserId, isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const UserHistory = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRecipes, setVisibleRecipes] = useState(6);

  // Add a flag to check if the component is initialized
  const [initialized, setInitialized] = useState(false);

  const initialize = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return; // Return early to avoid further execution
    } else {
      await fetchRecipes();
    }
  };

  const fetchRecipes = async () => {
    const token = getAuthToken();
    const userId = getUserId();
    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/fetchhistory/",
        { userid: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Fetched recipes response:", response.data); // Print response
      if (Array.isArray(response.data) && response.data.length > 0) {
        setRecipes(response.data);
      } else {
        setRecipes([]);
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized error:", error);
        navigate("/login");
      } else {
        // console.error("Error fetching recipes:", error);
      }
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async (historyId) => {
    try {
      const token = getAuthToken();
      const requestData = { id: historyId };
      //console.log("Deleting Recipe. Request Data:", requestData);
      const response = await axios.delete(
        "http://localhost:8000/recipe/deletehistory/",
        {
          data: requestData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecipes(recipes.filter((recipe) => recipe.id !== historyId));
      /*console.log(
        `Recipe with history ID ${historyId} removed from history. Response:`,
        response.data
      );*/
    } catch (error) {
      //console.error("Error removing recipe from history:", error);
    }
  };

  const handleRemoveAll = async () => {
    try {
      const token = getAuthToken();
      const userId = getUserId();
      const requestData = { userid: userId };
      // console.log("Deleting All Recipes. Request Data:", requestData);
      await axios.delete("http://localhost:8000/recipe/deleteallhistory/", {
        data: requestData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipes([]);
      // console.log("All recipes removed successfully.");
    } catch (error) {
      //console.error("Error removing all recipes:", error);
    }
  };

  const handleLoadMore = async () => {
    const token = getAuthToken();
    const userId = getUserId();
    try {
      const response = await axios.post(
        `http://localhost:8000/recipe/fetchhistory/?offset=${visibleRecipes}`,
        { userid: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        setRecipes([...recipes, ...response.data]);
        setVisibleRecipes(visibleRecipes + response.data.length);
      }
    } catch (error) {
      console.error("Error loading more recipes:", error);
    }
  };

  // Check if the component is initialized
  if (!initialized) {
    initialize();
    setInitialized(true); // Mark the component as initialized
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    navigate("/login");
    return null;
  }

  return (
    <div className="history-main">
      <div className="history-heading">
        History
        <button className="remove-all-button" onClick={handleRemoveAll}>
          Remove All History
        </button>
      </div>
      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onRemove={() => handleRemoveRecipe(recipe.id)}
              className="recipe-card"
            />
          ))
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
