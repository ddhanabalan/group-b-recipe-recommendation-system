import React, { useContext, useEffect, useState } from "react";
import Items from "../Items/Items";
import { RecipeContext } from "../../context/recipeContext";
import "../../styles/SavedItems.css";
import {
  clearAuthData,
  getAuthToken,
  getUserId,
  refreshAccessToken,
} from "../../utils/auth";
import Swal from "sweetalert2";

const SavedItems = () => {
  const { unsaveRecipe } = useContext(RecipeContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 21;

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const userId = getUserId();
        let authToken = getAuthToken();

        // Refresh token if not available or expired
        if (!authToken) {
          authToken = await refreshAccessToken();
        }

        const response = await fetch("http://localhost:8000/recipe/saved/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch saved recipes");
        }

        const data = await response.json();

        if (data.error && data.error === "Recipe already favorited") {
          Swal.fire({
            icon: "info",
            title: "Already Favorited",
            text: "This recipe is already in your favorites.",
            confirmButtonText: "OK",
          });
          setSavedRecipes([]);
          setLoading(false);
          return;
        }

        setSavedRecipes(data || []);
        setLoading(false);
      } catch (error) {
        if (error.message !== "Failed to fetch saved recipes") {
          setError(error.message);
        }
        setLoading(false);
      }
    };
    fetchSavedRecipes();
  }, []);

  const handleRemoveRecipe = async (recipeId) => {
    try {
      const userId = getUserId();
      let authToken = getAuthToken();

      if (!authToken) {
        authToken = await refreshAccessToken();
      }

      const response = await fetch(
        "http://localhost:8000/recipe/deletefavourite/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify({ userid: userId, recipeid: recipeId }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthData();
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to remove recipe");
      }

      setSavedRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.recipeid !== recipeId)
      );

      Swal.fire({
        title: "Removed",
        text: "Recipe has been removed from your favorites.",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        confirmButtonText: "OK",
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savedRecipes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="saveditems">
      <hr />
      <div>
        <div className="saveditems-format">
          {currentItems && currentItems.length > 0 ? (
            <div className="saveditems-format">
              {currentItems.map((item, i) => (
                <div className="saved-recipe-card" key={i}>
                  <Items
                    recipeid={item.recipeid}
                    title={item.title}
                    img={item.img}
                    total_mins={item.total_mins}
                    calories={item.calories}
                    rating={item.rating}
                  />
                  <button
                    className="removesaves-button"
                    onClick={() => handleRemoveRecipe(item.recipeid)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved recipes found.</p>
          )}
        </div>
        <nav>
          <ul className="pagination">
            {Array.from({
              length: Math.ceil(savedRecipes.length / itemsPerPage),
            }).map((_, index) => (
              <li key={index} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SavedItems;
