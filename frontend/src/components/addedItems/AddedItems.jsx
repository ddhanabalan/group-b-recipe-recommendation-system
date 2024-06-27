import React, { useEffect, useState } from "react";
import Items from "../Items/Items";
import "../../styles/SavedItems.css";
import Swal from "sweetalert2";
import { getUserId } from "../../utils/auth";

const AddedItems = () => {
  const [addedRecipes, setAddedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [editRecipeData, setEditRecipeData] = useState({});
  const itemsPerPage = 20;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = addedRecipes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (item) => {
    setEditRecipeId(item.recipeid);
    setEditRecipeData({
      title: item.title,
      img: item.img,
      total_mins: item.total_mins,
      calories: item.calories,
      rating: item.rating,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/recipe/${editRecipeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editRecipeData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save edits");
      }

      // Update addedRecipes state or fetch updated data
      // Example:
      // const updatedData = await response.json();
      // setAddedRecipes(updatedData);

      // Reset edit state
      setEditRecipeId(null);
      setEditRecipeData({});
    } catch (error) {
      console.error("Error saving edit:", error);
      // Handle error saving edit
    }
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
          {currentItems && currentItems.length > 0 ? (
            <div className="saveditems-format">
              {currentItems.map((item, i) => (
                <div className="saved-recipe-card" key={i}>
                  {editRecipeId === item.recipeid ? (
                    <div>
                      <input
                        type="text"
                        value={editRecipeData.title || ""}
                        onChange={(e) =>
                          setEditRecipeData({
                            ...editRecipeData,
                            title: e.target.value,
                          })
                        }
                      />
                      {/* Add more fields for editing */}
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={() => setEditRecipeId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Items
                      recipeid={item.recipeid}
                      title={item.title}
                      img={item.img}
                      total_mins={item.total_mins}
                      calories={item.calories}
                      rating={item.rating}
                      onEdit={() => handleEdit(item)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No added recipes found.</p>
          )}
        </div>
      </div>
      {addedRecipes.length > itemsPerPage && (
        <nav>
          <ul className="pagination">
            {Array.from({
              length: Math.ceil(addedRecipes.length / itemsPerPage),
            }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
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
      )}
    </div>
  );
};

export default AddedItems;
