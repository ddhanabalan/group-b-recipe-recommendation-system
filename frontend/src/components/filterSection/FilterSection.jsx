import React, { useContext, useState } from "react";
import { FilterContext } from "../../context/filterContext";
import { RecipeContext } from "../../context/recipeContext";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "../../styles/FilterSection.css";

const FilterSection = ({ setSearchQuery }) => {
  const { filter, dispatch } = useContext(FilterContext);
  const { distinctCategories, all_recipe } = useContext(RecipeContext);
  const [showCategories, setShowCategories] = useState(false);

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    let updatedCategories;

    if (checked) {
      updatedCategories = [...filter.category, name];
    } else {
      updatedCategories = filter.category.filter((cat) => cat !== name);
    }

    dispatch({ type: "SET_FILTER", payload: { category: updatedCategories } });
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_FILTER", payload: { maxTime: parseInt(value, 10) } });
  };

  const handleCaloriesChange = (e) => {
    const { value } = e.target;
    dispatch({
      type: "SET_FILTER",
      payload: { maxCalories: parseInt(value, 10) },
    });
  };

  const handleApplyFilter = () => {
    // Apply filter logic as needed
  };

  const handleResetFilter = () => {
    dispatch({ type: "RESET_FILTER" });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    console.log(query);
  };

  const filteredRecipes = all_recipe.filter((recipe) => {
    const searchQueryLowerCase = filter.searchQuery
      ? filter.searchQuery.toLowerCase()
      : "";
    console.log("Search Query Lowercase:", searchQueryLowerCase);

    const categoryFilter =
      filter.category.length === 0 ||
      recipe.category.some((cat) =>
        cat.toLowerCase().includes(searchQueryLowerCase)
      );
    const maxTimeFilter = recipe.total_mins <= filter.maxTime;
    const maxCaloriesFilter = recipe.calorie <= filter.maxCalories;

    let searchFilter = true; // Default to true
    if (searchQueryLowerCase) {
      searchFilter =
        recipe.title.toLowerCase().includes(searchQueryLowerCase) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchQueryLowerCase)
        ) ||
        recipe.category.some((cat) =>
          cat.toLowerCase().includes(searchQueryLowerCase)
        );
    }

    console.log("Category Filter:", categoryFilter);
    console.log("Max Time Filter:", maxTimeFilter);
    console.log("Max Calories Filter:", maxCaloriesFilter);
    console.log("Search Filter:", searchFilter);

    return categoryFilter && maxTimeFilter && maxCaloriesFilter && searchFilter;
  });

  return (
    <div className="filtersection">
      <h1
        style={{
          fontFamily: "serif",
          fontSize: 30,
          fontWeight: 300,
          paddingBottom: 10,
        }}
      >
        Filter Recipes:
      </h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search recipes by name"
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div
        className="category-header"
        onClick={() => setShowCategories(!showCategories)}
      >
        Categories{" "}
        {showCategories ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
      </div>
      {showCategories && (
        <div className="category-container">
          {distinctCategories.map((category) => (
            <label key={category} className="category-label">
              <input
                type="checkbox"
                name={category}
                onChange={handleCategoryChange}
                checked={filter.category.includes(category)}
              />
              {category}
            </label>
          ))}
        </div>
      )}
      <br />
      <label className="total-mins">
        Total Time (mins):
        <input
          type="range"
          min="0"
          max="120"
          step="5"
          value={filter.maxTime}
          onChange={handleTimeChange}
        />
        {filter.maxTime} mins
      </label>
      <br />
      <label className="max-calorie">
        Max Calories:
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={filter.maxCalories}
          onChange={handleCaloriesChange}
        />
        {filter.maxCalories} calories
      </label>
      <br />
      <button className="reset-filter" onClick={handleResetFilter}>
        Reset Filter
      </button>
    </div>
  );
};

export default FilterSection;
