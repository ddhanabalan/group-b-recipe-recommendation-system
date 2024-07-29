import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../../components/recipeCard/RecipeCard";
import "../../styles/UserHistory.css";
import {
  getAuthToken,
  setAuthToken,
  clearAuthData,
  isAuthenticated,
  getUserId,
} from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const UserHistory = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      if (!isAuthenticated()) {
        await refreshTokensAndFetchRecipes(1);
      } else {
        await fetchRecipes(1);
      }
      setInitialized(true);
    } catch (error) {
      console.error("Initialization error:", error);
      navigate("/login");
    }
  };

  const fetchRecipes = async (pageNo) => {
    const { access: accessToken } = getAuthToken();
    const userId = getUserId();
    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/fetchhistory/",
        { userid: userId, pageNo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        setRecipes((prevRecipes) =>
          pageNo === 1 ? response.data : [...prevRecipes, ...response.data]
        );
      } else {
        if (pageNo === 1) setRecipes([]);
      }
      setLoading(false);
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleRequestError = async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized error:", error);
      await refreshTokensAndFetchRecipes(currentPage);
    } else {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    }
  };

  const refreshTokensAndFetchRecipes = async (pageNo) => {
    try {
      const { refresh: refreshToken } = getAuthToken();
      const response = await axios.post(
        "http://localhost:8000/authentication/token/refresh/",
        { refresh: refreshToken }
      );
      const { access, refresh } = response.data;
      setAuthToken({ access, refresh });
      await fetchRecipes(pageNo);
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData();
      navigate("/login");
    }
  };

  const handleRemoveRecipe = async (historyId) => {
    try {
      const { access: accessToken } = getAuthToken();
      const requestData = { id: historyId };
      await axios.delete("http://localhost:8000/recipe/deletehistory/", {
        data: requestData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== historyId)
      );
    } catch (error) {
      console.error("Error removing recipe from history:", error);
    }
  };

  const handleRemoveAll = async () => {
    try {
      const { access: accessToken } = getAuthToken();
      const userId = getUserId();
      const requestData = { userid: userId };
      await axios.delete("http://localhost:8000/recipe/deleteallhistory/", {
        data: requestData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecipes([]);
    } catch (error) {
      console.error("Error removing all recipes:", error);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchRecipes(nextPage);
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
      {recipes.length > 0 && (
        <button className="load-more-button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default UserHistory;
