import React, { useContext, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import FilterSection from "../../components/filterSection/FilterSection";
import Sort from "../../components/sort/Sort"; // Import the Sort component
import "../../styles/Recipe.css";
import Items from "../../components/Items/Items";
import Footer from "../../components/Footer/Footer";
import { RecipeContext } from "../../context/recipeContext";
import { SortProvider, useSortContext } from "../../context/sortContext";
import { FilterContext } from "../../context/filterContext";

const Recipe = () => {
  const { allRecipes } = useContext(RecipeContext);
  const { sortFunction } = useSortContext(); //sortFunction from SortContext
  const { filter, setFilter } = useContext(FilterContext);
  console.log("allRecipes:", allRecipes);
  console.log("sortFunction:", sortFunction);
  console.log("Filter:", filter);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Apply filters when filter is not empty, else show all recipes
  const filteredRecipes = allRecipes.filter((recipe) => {
    const categoryFilter =
      filter.category.length === 0 ||
      recipe.categories.some((cat) => filter.category.includes(cat));
    const maxTimeFilter = recipe.total_mins <= filter.maxTime;
    const maxCaloriesFilter = recipe.calories <= filter.maxCalories;
    return categoryFilter && maxTimeFilter && maxCaloriesFilter;
  });
  console.log("filteredRecipes:", filteredRecipes);

  // Apply search filter
  const searchedRecipes = searchQuery
    ? filteredRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredRecipes;

  // Sort recipes based on sorting function
  const sortedRecipes = searchedRecipes.sort(sortFunction);
  console.log("sortedRecipes", sortedRecipes);

  return (
    <SortProvider>
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
                  <Sort /> {/* Use the Sort component here */}
                </div>
                <hr />
                <div className="recipe-items">
                  {sortedRecipes.length > 0 ? (
                    sortedRecipes.map((item, i) => (
                      <Items
                        key={i}
                        id={item.recipeid}
                        title={item.title}
                        imageurl={item.img}
                        total_mins={item.total_mins}
                        calorie={item.calories}
                        ratings={item.rating}
                      />
                    ))
                  ) : (
                    <p>No recipes found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </SortProvider>
  );
};

export default Recipe;
