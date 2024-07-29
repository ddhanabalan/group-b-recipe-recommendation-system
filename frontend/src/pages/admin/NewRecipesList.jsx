import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/RecipesList.css";
import {
  getAuthToken,
  clearAuthToken,
  refreshAccessToken,
} from "../../utils/auth";

const RecipeModal = ({ recipe, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const mediaItems = [
    { type: "image", src: recipe.img },
    ...(recipe.thumbnails || []).map((thumbnail) => ({
      type: "thumbnail",
      src: thumbnail,
    })),
    ...(recipe.video
      ? [{ type: "video-thumbnail", src: recipe.thumbnail }]
      : []),
    ...(recipe.video ? [{ type: "video", src: recipe.video }] : []),
  ].filter((item) => item.src);

  const handlePrevious = () => {
    setCurrentMediaIndex(
      (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length
    );
  };

  const handleNext = () => {
    setCurrentMediaIndex((currentMediaIndex + 1) % mediaItems.length);
  };

  const handleCloseModal = () => {
    setCurrentMediaIndex(0);
    onClose();
  };

  const handleThumbnailClick = (index) => {
    setCurrentMediaIndex(index);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{recipe.title}</h2>
          <span className="close" onClick={handleCloseModal}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div className="media-section">
            <div className="main-media-container">
              {mediaItems[currentMediaIndex].type === "video" ? (
                <div className="video-wrapper">
                  <video controls>
                    <source
                      src={mediaItems[currentMediaIndex].src}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img
                  className="main-image"
                  src={mediaItems[currentMediaIndex].src}
                  alt={`Media ${currentMediaIndex + 1}`}
                />
              )}
            </div>
            {recipe.video && mediaItems[currentMediaIndex].type !== "video" && (
              <div className="video-preview-container">
                <img
                  className="video-thumbnail-preview"
                  src={recipe.thumbnail}
                  alt="Video Thumbnail Preview"
                  onClick={() =>
                    setCurrentMediaIndex(
                      mediaItems.findIndex((item) => item.type === "video")
                    )
                  }
                />
              </div>
            )}
            {mediaItems.length > 1 && (
              <div className="gallery-navigation">
                <button onClick={handlePrevious} className="nav-button">
                  &lt;
                </button>
                <button onClick={handleNext} className="nav-button">
                  &gt;
                </button>
              </div>
            )}
          </div>
          <div className="content-section">
            <div className="modal-details">
              <p>
                <strong>Recipe ID:</strong> {recipe.recipeid}
              </p>
              <p>
                <strong>User ID:</strong> {recipe.userid || "Unknown User"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {moment(recipe.created_at).format("MM/DD/YYYY, hh:mm:ss A")}
              </p>
              <p>
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <p>
                <strong>Day Time of Cooking:</strong> {recipe.daytimeofcooking}
              </p>
              <p>
                <strong>Season:</strong> {recipe.season}
              </p>
              <p>
                <strong>Total Mins:</strong> {recipe.total_mins}
              </p>
              <p>
                <strong>Calories:</strong> {recipe.calories}
              </p>
              <p>
                <strong>Veg/Nonveg:</strong> {recipe.veg_nonveg}
              </p>
              <p>
                <strong>Categories:</strong> {recipe.categories.join(", ")}
              </p>
              <p>
                <strong>Total Reviews:</strong> {recipe.total_reviews}
              </p>
              <p>
                <strong>Rating:</strong> {recipe.rating}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const NewRecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputPageNo, setInputPageNo] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const history = useNavigate();

  useEffect(() => {
    fetchData(pageNo);
    fetchTotalRecipes();
  }, [pageNo]);

  useEffect(() => {
    const filtered = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.recipeid.toString().includes(searchQuery)
    );
    setFilteredRecipes(filtered);
  }, [recipes, searchQuery]);

  const fetchData = async (pageNumber) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/newrecipesdetails/",
        { page: pageNumber }
      );
      setRecipes(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await handleTokenRefreshAndRetry(fetchData, pageNumber);
      } else {
        console.error("Error fetching recipes:", error);
      }
    }
  };

  const fetchTotalRecipes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/recipe/newrecipescount/"
      );
      setTotalRecipes(response.data || 0);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await handleTokenRefreshAndRetry(fetchTotalRecipes);
      } else {
        console.error("Error fetching total recipes:", error);
      }
    }
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (e) => {
    setInputPageNo(e.target.value);
  };

  const handleSubmitPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPageNo);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalRecipes / 20)
    ) {
      setPageNo(pageNumber);
    }
    setInputPageNo("");
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveRecipe = async (recipeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const authToken = getAuthToken();
        await axios.delete("http://localhost:8000/recipe/deleterecipe/", {
          headers: {
            Authorization: `Bearer ${authToken.access}`,
          },
          data: {
            recipeid: recipeId,
          },
        });
        setRecipes(recipes.filter((recipe) => recipe.recipeid !== recipeId));
        setTotalRecipes(totalRecipes - 1); // Update total recipes count
        Swal.fire("Deleted!", "Your recipe has been deleted.");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await handleTokenRefreshAndRetry(handleRemoveRecipe, recipeId);
        } else {
          console.error("Error removing recipe:", error);
          Swal.fire(
            "Error",
            "There was an error deleting the recipe. Please try again."
          );
        }
      }
    }
  };

  const handleTokenRefreshAndRetry = async (retryFunction, ...args) => {
    try {
      await refreshAccessToken();
      await retryFunction(...args);
    } catch (error) {
      console.error("Error refreshing token and retrying operation:", error);
      clearAuthToken();
      history("/login");
    }
  };
  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="recipeslist-content">
          <h2
            style={{ marginBottom: 10, display: "flex", alignItems: "center" }}
          >
            All Recipes
            <div className="page-number-input" style={{ marginLeft: "auto" }}>
              <form
                onSubmit={handleSubmitPage}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="number"
                  value={inputPageNo}
                  onChange={handlePageChange}
                  placeholder="No"
                  min="1"
                  className="page-input"
                  max={Math.ceil(totalRecipes / 20)}
                  style={{ width: "100px", marginRight: "5px" }}
                  onKeyDown={(e) => {
                    if (e.code === "Minus" || e.key === "-" || e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                />
                <button type="submit" className="pagination-input-button">
                  Go
                </button>
              </form>
            </div>
          </h2>
          <p>Total Recipes: {totalRecipes}</p>
          <div className="feedback-actions">
            <input
              type="text"
              placeholder="Search by Recipe ID or Title..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <table className="recipes-table">
            <thead>
              <tr>
                <th>Recipe Id</th>
                <th>Title</th>
                <th>User Id</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe, index) => (
                <tr key={index}>
                  <td>{recipe.recipeid}</td>
                  <td>{recipe.title}</td>
                  <td>{recipe.userid || "Not available"}</td>
                  <td>
                    {moment(recipe.created_at).format("MM/DD/YYYY, hh:mm:ss A")}
                  </td>{" "}
                  <td>
                    <button
                      onClick={() => handleViewRecipe(recipe)}
                      className="view-button"
                    >
                      View
                    </button>
                    {isModalOpen && (
                      <RecipeModal
                        recipe={selectedRecipe}
                        onClose={handleCloseModal}
                      />
                    )}
                    <button
                      onClick={() => handleRemoveRecipe(recipe.recipeid)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              style={{ backgroundColor: "#e19660", border: "1px solid #ccc" }}
            >
              Prev
            </button>
            <span>
              {pageNo} of {Math.ceil(totalRecipes / 20)}
            </span>
            <button
              onClick={handleNextPage}
              style={{ backgroundColor: "#e19660", border: "1px solid #ccc" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewRecipesList;
