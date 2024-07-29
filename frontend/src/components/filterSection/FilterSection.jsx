import React, { useContext, useState, useEffect } from "react";
import { FilterContext } from "../../context/filterContext";
import { RecipeContext } from "../../context/recipeContext";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "../../styles/FilterSection.css";

const FilterSection = ({ setSearchQuery }) => {
  const { filter, dispatch } = useContext(FilterContext);
  const {
    allRecipes,
    distinctCategories,
    distinctSeasons,
    distinctDayOfTimeCooking,
    distinctVegNonVeg,
  } = useContext(RecipeContext);
  const [showCategories, setShowCategories] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState(allRecipes);

  useEffect(() => {
    const updatedFilteredRecipes = allRecipes.filter((recipe) => {
      const searchQueryLowerCase = filter.searchQuery
        ? filter.searchQuery.toLowerCase()
        : "";

      const categoryFilter =
        filter.category.length === 0 ||
        recipe.categories.some((cat) =>
          cat.toLowerCase().includes(searchQueryLowerCase)
        );
      const maxTimeFilter =
        filter.maxTime === null || recipe.total_mins <= filter.maxTime;
      const maxCaloriesFilter =
        filter.maxCalories === null || recipe.calories <= filter.maxCalories;
      const seasonFilter =
        filter.season === null || recipe.season === filter.season;
      const timeOfDayFilter =
        filter.timeOfDay === null ||
        recipe.daytimeofcooking === filter.timeOfDay;
      const vegNonVegFilter =
        filter.vegNonVeg === null || recipe.vegNonVeg === filter.vegNonVeg;

      let searchFilter = true;
      if (searchQueryLowerCase) {
        searchFilter =
          recipe.title.toLowerCase().includes(searchQueryLowerCase) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchQueryLowerCase)
          ) ||
          recipe.categories.some((cat) =>
            cat.toLowerCase().includes(searchQueryLowerCase)
          );
      }

      return (
        categoryFilter &&
        maxTimeFilter &&
        maxCaloriesFilter &&
        seasonFilter &&
        timeOfDayFilter &&
        vegNonVegFilter &&
        searchFilter
      );
    });

    setFilteredRecipes(updatedFilteredRecipes);
  }, [
    allRecipes,
    filter,
    filter.searchQuery,
    filter.maxCalories,
    filter.maxTime,
    filter.season,
    filter.timeOfDay,
    filter.vegNonVeg,
  ]);

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    let updatedCategories;

    if (checked) {
      updatedCategories = [...filter.category, name];
    } else {
      updatedCategories = filter.category.filter((cat) => cat !== name);
    }

    dispatch({
      type: "SET_FILTER",
      payload: { category: updatedCategories },
    });
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;
    dispatch({
      type: "SET_FILTER",
      payload: { maxTime: value === "" ? null : parseInt(value, 10) },
    });
  };

  const handleCaloriesChange = (e) => {
    const { value } = e.target;
    dispatch({
      type: "SET_FILTER",
      payload: { maxCalories: value === "" ? null : parseInt(value, 10) },
    });
  };

  const handleSeasonChange = (e) => {
    const { value } = e.target;
    dispatch({
      type: "SET_FILTER",
      payload: { season: value === "" ? null : value },
    });
  };

  const handleTimeOfDayChange = (e) => {
    const { value } = e.target;
    dispatch({
      type: "SET_FILTER",
      payload: { timeOfDay: value === "" ? null : value },
    });
  };

  const handleVegNonVegChange = (e) => {
    const { value } = e.target;
    dispatch({
      type: "SET_FILTER",
      payload: { vegNonVeg: value === "" ? null : value },
    });
  };

  const handleResetFilter = () => {
    dispatch({ type: "RESET_FILTER" });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

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
          id="recipe_search"
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
                id="filter_cat"
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
          max="14500"
          step="5"
          value={filter.maxTime || ""}
          onChange={handleTimeChange}
        />
        {filter.maxTime !== null ? `${filter.maxTime} mins` : "All"}
      </label>
      <br />
      <label className="max-calorie">
        Max Calories:
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={filter.maxCalories || ""}
          onChange={handleCaloriesChange}
        />
        {filter.maxCalories !== null ? `${filter.maxCalories} calories` : "All"}
      </label>
      <br />

      <label className="season-label">
        Season:
        <select value={filter.season || ""} onChange={handleSeasonChange}>
          <option value="">All</option>
          {distinctSeasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label className="time-of-day-label">
        Time of Day:
        <select value={filter.timeOfDay || ""} onChange={handleTimeOfDayChange}>
          <option value="">All</option>
          {distinctDayOfTimeCooking.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label className="veg-non-veg-label">
        Veg/Non-Veg:
        <select value={filter.vegNonVeg || ""} onChange={handleVegNonVegChange}>
          <option value="">All</option>
          {distinctVegNonVeg.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button className="reset-filter" onClick={handleResetFilter}>
        Reset Filter
      </button>
    </div>
  );
};

export default FilterSection;
