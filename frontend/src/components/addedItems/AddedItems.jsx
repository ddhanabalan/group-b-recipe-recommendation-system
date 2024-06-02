import React, { useEffect, useState } from "react";
import Items from "../Items/Items";
import "../../styles/SavedItems.css";
import Swal from "sweetalert2";
import { getUserId } from "../../utils/auth";

const AddedItems = () => {
  const [addedRecipes, setAddedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddedRecipes = async () => {
      try {
        const userId = getUserId();
        const response = await fetch(
          "http://localhost:8000/recipe/userrecipes/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userid: userId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch added recipes");
        }

        const data = await response.json();
        setAddedRecipes(data || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAddedRecipes();
  }, []);

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
          {addedRecipes && addedRecipes.length > 0 ? (
            <div className="saveditems-format">
              {addedRecipes.map((item, i) => (
                <div className="saved-recipe-card" key={i}>
                  <Items
                    recipeid={item.recipeid}
                    title={item.title}
                    img={item.img}
                    total_mins={item.total_mins}
                    calories={item.calories}
                    rating={item.rating}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No added recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddedItems;
