import React, { useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import FilterSection from "../../components/filterSection/FilterSection";
import Sort from "../../components/sort/Sort";
import "../../styles/Recipe.css";
import Items from "../../components/items/Items";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Footer from "../../components/footer/Footer";
import { RecipeContext } from "../../context/recipeContext";
const Recipe = () => {
  const { value } = useContext(RecipeContext);
  return (
    <div>
      <Navbar />
      <div className="recipecontainer">
        <div className="recipe-filter">
          <FilterSection />
        </div>
        <div className="recipe-view--sort">
          <div className="sort-filter">
            <Sort />
            <ArrowDropDownIcon />
          </div>
          <div className="main-recipe-section">
            <div>
              <h1>Recipes</h1>
              <hr />
              <div className="recipe-items">
                {value.map((item, i) => {
                  return (
                    <Items
                      key={i}
                      id={item.id}
                      title={item.title}
                      imageurl={item.imageurl}
                      total_mins={item.total_mins}
                      calorie={item.calorie}
                      ratings={item.ratings}
                    />
                  );
                })}
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
