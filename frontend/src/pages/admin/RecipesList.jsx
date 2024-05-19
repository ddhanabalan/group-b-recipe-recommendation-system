import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/RecipesList.css";
import { getAuthToken, clearAuthToken } from "../../utils/auth";

const RecipeModal = ({ recipe, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>{recipe.title}</h2>
          <img
            src={recipe.img}
            alt={recipe.title}
            style={{ maxWidth: "50%" }}
          />
          <p>
            <b>Recipe ID:</b> {recipe.recipeid}
          </p>
          <p>
            <b>User ID:</b> {recipe.userid}
          </p>
          <p>
            <b>Created At:</b>
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
        "http://localhost:8000/recipe/allrecipeslimited/",
        { page: pageNumber }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
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
      pageNumber <= Math.ceil(totalRecipes / 50)
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
    try {
      const authToken = getAuthToken();
      await axios.delete("http://localhost:8000/recipe/deleterecipe/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          recipeid: recipeId,
        },
      });
      setRecipes(recipes.filter((recipe) => recipe.recipeid !== recipeId));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthToken();
        history("/login");
      } else {
        console.error("Error removing recipe:", error);
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
                  max={Math.ceil(totalRecipes / 50)}
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
              {pageNo} of {Math.ceil(totalRecipes / 50)}
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
