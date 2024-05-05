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

  // Sort recipes based on sorting function
  const sortedRecipes = allRecipes.sort(sortFunction);

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
                  {sortedRecipes.length > 0 ? (
                    sortedRecipes.map((item, i) => (
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
