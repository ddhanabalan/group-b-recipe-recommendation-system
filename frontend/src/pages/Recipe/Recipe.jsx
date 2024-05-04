import React, { useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import FilterSection from "../../components/filterSection/FilterSection";
import Sort from "../../components/sort/Sort";
import "../../styles/Recipe.css";
import Items from "../../components/Items/Items";
import Footer from "../../components/Footer/Footer";
import { RecipeContext } from "../../context/recipeContext";
import { useSortContext } from "../../context/sortContext";
const Recipe = () => {
  const { all_recipe } = useContext(RecipeContext);
  //console.log("value=", value);
  const { sortFunction } = useSortContext();
  const sortedRecipes = [...all_recipe].sort(sortFunction);
  //console.log("sortedRecipes", sortedRecipes);

  return (
    <div>
      <Navbar />
      <div className="recipecontainer">
        <div className="recipe-filter">
          <FilterSection />
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
                {sortedRecipes.map((item, i) => (
                  <Items
                    key={i}
                    id={item.id}
                    title={item.title}
                    imageurl={item.imageurl}
                    total_mins={item.total_mins}
                    calorie={item.calorie}
                    ratings={item.ratings}
                  />
                ))}
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
