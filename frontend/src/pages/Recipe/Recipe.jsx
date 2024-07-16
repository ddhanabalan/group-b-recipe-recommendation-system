import React, { useContext, useState } from "react";
import FilterSection from "../../components/filterSection/FilterSection";
import Navbar from "../../components/Navbar/Navbar";
import Sort from "../../components/sort/Sort";
import "../../styles/Recipe.css";
import Items from "../../components/Items/Items";
import Footer from "../../components/Footer/Footer";
import { RecipeContext } from "../../context/recipeContext";
import { useSortContext } from "../../context/sortContext";
import { FilterContext } from "../../context/filterContext";

const Recipe = () => {
  const { allRecipes } = useContext(RecipeContext);
  const { sortFunction } = useSortContext();
  const { filter } = useContext(FilterContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 51;
  const maxPaginationButtons = 5;

  const filteredRecipes = allRecipes.filter((recipe) => {
    const searchQueryLowerCase = searchQuery.toLowerCase();
    const categoryFilter =
      filter.category.length === 0 ||
      recipe.categories.some((cat) => filter.category.includes(cat));
    const maxTimeFilter =
      filter.maxTime === null || recipe.total_mins <= filter.maxTime;
    const maxCaloriesFilter =
      filter.maxCalories === null || recipe.calories <= filter.maxCalories;
    const seasonFilter = !filter.season || recipe.season === filter.season;
    const timeOfDayFilter =
      !filter.timeOfDay ||
      recipe.daytimeofcooking
        .toLowerCase()
        .includes(filter.timeOfDay.toLowerCase());
    const vegNonVegFilter =
      !filter.vegNonVeg ||
      recipe.veg_nonveg.toLowerCase() === filter.vegNonVeg.toLowerCase();

    return (
      (recipe.title.toLowerCase().includes(searchQueryLowerCase) ||
        searchQueryLowerCase === "") &&
      categoryFilter &&
      maxTimeFilter &&
      maxCaloriesFilter &&
      seasonFilter &&
      timeOfDayFilter &&
      vegNonVegFilter
    );
  });

  const sortedRecipes = filteredRecipes.sort(sortFunction);
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = sortedRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationItems = () => {
    const totalPages = Math.ceil(sortedRecipes.length / recipesPerPage);
    const activePage = currentPage;
    const pages = [];
    if (totalPages <= maxPaginationButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={activePage === i ? "active" : ""}
            onClick={() => paginate(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      const startPage = Math.max(
        1,
        activePage - Math.floor(maxPaginationButtons / 2)
      );
      const endPage = Math.min(
        totalPages,
        startPage + maxPaginationButtons - 1
      );

      if (startPage > 1) {
        pages.push(
          <button key={1} onClick={() => paginate(1)}>
            1
          </button>
        );
        if (startPage > 2) {
          pages.push(<span key="ellipsis1">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={activePage === i ? "active" : ""}
            onClick={() => paginate(i)}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(<span key="ellipsis2">...</span>);
        }
        pages.push(
          <button key={totalPages} onClick={() => paginate(totalPages)}>
            {totalPages}
          </button>
        );
      }
    }
    return pages;
  };

  return (
    <div>
      <Navbar />
      <div className="recipecontainer">
        <div className="recipe-filter">
          <FilterSection setSearchQuery={setSearchQuery} />
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
                      recipeid={item.recipeid}
                      title={item.title}
                      img={item.img}
                      total_mins={item.total_mins}
                      calories={item.calories}
                      rating={item.rating}
                    />
                  ))
                ) : (
                  <p>No recipes found.</p>
                )}
              </div>
              <div className="pagination">{getPaginationItems()}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recipe;
