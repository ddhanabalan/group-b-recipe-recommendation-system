import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "../../components/admin/AdminSideBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/RecipesList.css";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/recipe/recipereviewslimited/",
          { page: pageNo }
        );
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [pageNo]);

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="dashboard-area">
        <AdminSideBar />
        <div className="recipeslist-content">
          <h2 style={{ marginBottom: 20 }}>All Recipes</h2>
          <table className="recipes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe, index) => (
                <tr key={index}>
                  <td>{recipe.name}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.createdBy}</td>
                  <td>{recipe.dateCreated}</td>
                  <td>
                    <button className="view-button">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button onClick={handlePrevPage}>Prev</button>
            <span>{pageNo}</span>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecipesList;
