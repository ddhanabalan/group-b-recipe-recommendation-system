import React, { useContext, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import FilterSection from "../../components/filterSection/FilterSection";
import Sort from "../../components/sort/Sort";
import "../../styles/Recipe.css";
import Items from "../../components/Items/Items";
import Footer from "../../components/Footer/Footer";
import { RecipeContext } from "../../context/recipeContext";
import { FilterContext } from "../../context/filterContext";
import { useSortContext } from "../../context/sortContext";

const Recipe = () => {
  const { all_recipe } = useContext(RecipeContext);
  const { filter } = useContext(FilterContext);
  const { sortFunction } = useSortContext();

  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 9; // Number of items to show per page

  // Apply filters when filter is not empty, else show all recipes
  const filteredRecipes = all_recipe.filter((recipe) => {
    const categoryFilter =
      filter.category.length === 0 ||
      recipe.category.some((cat) => filter.category.includes(cat));
    const maxTimeFilter = recipe.total_mins <= filter.maxTime;
    const maxCaloriesFilter = recipe.calorie <= filter.maxCalories;
    return categoryFilter && maxTimeFilter && maxCaloriesFilter;
  });

  // Apply search filter
  const searchedRecipes = searchQuery
    ? filteredRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredRecipes;

  // Sort recipes based on sorting function
  const sortedRecipes = searchedRecipes.sort(sortFunction);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = sortedRecipes.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className="recipecontainer">
        <div className="recipe-filter">
          <FilterSection setSearchQuery={setSearchQuery} />{" "}
        </div>
        <div className="recipe-view--sort">
          <div className="main-recipe-section">
            <div>
              <div className="main-recipe-section-header">
                <h1>Recipes</h1>
                <Sort />
              </div>
              <hr />
              <div className="recipe-items">
                {currentRecipes.length > 0 ? (
                  currentRecipes.map((item, i) => (
                    <Items
                      key={i}
                      id={item.id}
                      title={item.title}
                      imageurl={item.imageurl}
                      total_mins={item.total_mins}
                      calorie={item.calorie}
                      ratings={item.ratings}
                    />
                  ))
                ) : (
                  <p>No recipes found based on current filters.</p>
                )}
              </div>
              {/* Horizontal Pagination */}
              <div className="pagination-container">
                <ul className="pagination">
                  {Array(Math.ceil(sortedRecipes.length / itemsPerPage))
                    .fill()
                    .map((_, index) => (
                      <li
                        key={index}
                        className={currentPage === index + 1 ? "active" : ""}
                      >
                        <button onClick={() => paginate(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recipe;
