import React, { useContext, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sort from "../../components/sort/Sort"; // Import the Sort component
import "../../styles/Recipe.css";
import Items from "../../components/Items/Items";
import Footer from "../../components/Footer/Footer";
import { RecipeContext } from "../../context/recipeContext";
import { SortProvider, useSortContext } from "../../context/sortContext";

const Recipe = () => {
  const { allRecipes } = useContext(RecipeContext);
  const { sortFunction } = useSortContext(); // sortFunction from SortContext
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  // Sort recipes based on sorting function
  const sortedRecipes = allRecipes.sort(sortFunction);

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = sortedRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <SortProvider>
      <div>
        <Navbar />
        <div className="recipecontainer">
          <div className="recipe-view--sort">
            <div className="main-recipe-section">
              <div>
                <div className="main-recipe-section-header">
                  <h1>Recipes</h1>
                  <Sort /> {/* Use the Sort component here */}
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
                {/* Pagination */}
                <div className="pagination">
                  {Array.from(
                    {
                      length: Math.ceil(sortedRecipes.length / recipesPerPage),
                    },
                    (_, i) => (
                      <button key={i} onClick={() => paginate(i + 1)}>
                        {i + 1}
                      </button>
                    )
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
