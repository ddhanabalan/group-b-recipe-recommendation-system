import React, { useContext, useEffect, useState } from "react";
import Items from "../Items/Items";
import { RecipeContext } from "../../context/recipeContext";
import "../../styles/SavedItems.css";
import { getUserId } from "../../utils/auth";
import Swal from "sweetalert2"; // Import SweetAlert

const SavedItems = () => {
  const { unsaveRecipe } = useContext(RecipeContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const userId = getUserId();
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

        // Check if the response indicates "Recipe already favorited"
        if (data.error && data.error === "Recipe already favorited") {
          // Use SweetAlert to show an alert
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
        // Check if the error is related to the "Recipe already favorited" case
        if (error.message !== "Failed to fetch saved recipes") {
          setError(error.message);
        }
        setLoading(false);
      }
    };
    fetchSavedRecipes();
  }, []);

  const handleRemoveRecipe = (recipeId) => {
    unsaveRecipe(recipeId);
  };

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
          {savedRecipes && savedRecipes.length > 0 ? (
            <div className="saveditems-format">
              {savedRecipes.map((item, i) => (
                <div className="saved-recipe-card" key={i}>
                  <Items
                    recipeid={item.recipeid}
                    title={item.title}
                    img={item.img}
                    total_mins={item.total_mins}
                    calories={item.calories}
                    rating={item.rating}
                  />
                  <button onClick={() => handleRemoveRecipe(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedItems;
