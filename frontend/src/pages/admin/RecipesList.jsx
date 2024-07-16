import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import {
  clearAuthToken,
  getAuthToken,
  refreshAccessToken,
  isAuthenticated,
  getUserRole,
} from "../../utils/auth";
import "../../styles/RecipesList.css";

const RecipeModal = ({ recipe, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);

  const handleVideoClick = () => {
    setShowVideo(true);
    setShowThumbnail(false); // Ensure only one media type is displayed
  };

  const handleThumbnailClick = () => {
    setShowThumbnail(true);
    setShowVideo(false); // Ensure only one media type is displayed
  };

  const handleCloseModal = () => {
    setShowVideo(false); // Reset video state on modal close
    setShowThumbnail(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleCloseModal}>
            &times;
          </span>
          <h2 style={{ paddingBottom: "20px", textDecoration: "underline" }}>
            {recipe.title}
          </h2>
          <img
            src={recipe.img}
            alt={recipe.title}
            style={{ maxWidth: "30%" }}
          />
          <p>
            <b>Recipe ID:</b> {recipe.recipeid}
          </p>
          <p>
            <b>User ID:</b> {recipe.userid}
          </p>
          <p>
            <b>Created At:</b>{" "}
            {moment(recipe.created_at).format("MM/DD/YYYY, hh:mm:ss A")}
          </p>
          <p>
            <b>Ingredients:</b> {recipe.ingredients}
          </p>
          <p>
            <b>Day time of cooking:</b> {recipe.daytimeofcooking}
          </p>
          <p>
            <b>Season:</b> {recipe.season}
          </p>
          <p>
            <b>Total mins:</b> {recipe.total_mins}
          </p>
          <p>
            <b>Calories: </b>
            {recipe.calories}
          </p>
          <p>
            <b>Veg/Nonveg:</b> {recipe.veg_nonveg}
          </p>
          <p>
            <b>Categories: </b>
            {recipe.categories}
          </p>
          <p>
            <b>Total reviews:</b> {recipe.total_reviews}
          </p>
          <p>
            <b>Rating:</b> {recipe.rating}
          </p>
          {recipe.video && (
            <div className="media-container">
              <div className="media-button">
                <button onClick={handleVideoClick}>Play Video</button>
                {showVideo && (
                  <div className="video-wrapper">
                    <video controls>
                      <source src={recipe.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>
          )}
          {recipe.thumbnail && (
            <div className="media-container">
              <div className="media-button">
                <button onClick={handleThumbnailClick}>View Thumbnail</button>
                {showThumbnail && (
                  <img
                    src={recipe.thumbnail}
                    alt="Recipe Thumbnail"
                    style={{ width: "30%" }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputPageNo, setInputPageNo] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== "admin") {
      history("/login");
      return;
    }
    fetchData(pageNo);
    fetchTotalRecipes();
  }, [pageNo, history]);

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
        "http://localhost:8000/recipe/allrecipeslimited/",
        { page: pageNumber }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      if (error.response && error.response.status === 401) {
        await handleTokenRefresh(() => fetchData(pageNumber));
      }
    }
  };

  const fetchTotalRecipes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/recipe/recipescount/"
      );
      setTotalRecipes(response.data || 0);
    } catch (error) {
      console.error("Error fetching total recipes:", error);
      if (error.response && error.response.status === 401) {
        await handleTokenRefresh(fetchTotalRecipes);
      }
    }
  };

  const handleTokenRefresh = async (retryFunction) => {
    try {
      await refreshAccessToken();
      const authToken = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      retryFunction();
    } catch (refreshError) {
      console.error("Error refreshing access token:", refreshError);
      clearAuthToken();
      history("/login");
    }
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNo < Math.ceil(totalRecipes / 20)) {
      setPageNo(pageNo + 1);
    }
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
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
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
        setTotalRecipes(totalRecipes - 1);

        Swal.fire("Deleted!", "The recipe has been deleted.");
      } catch (error) {
        console.error("Error removing recipe:", error);
        if (error.response && error.response.status === 401) {
          await handleTokenRefresh(() => handleRemoveRecipe(recipeId));
        }
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="recipeslist-content">
          <h2
            style={{ marginBottom: 20, display: "flex", alignItems: "center" }}
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

export default RecipesList;
