import React, { useState, useEffect, useContext } from "react";
import { RecipeContext } from "../../context/recipeContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import "../../styles/AddNewRecipe.css";

const EditRecipe = ({ recipeId }) => {
  const { allRecipes } = useContext(RecipeContext);
  const [formData, setFormData] = useState({
    title: "",
    img: "",
    video: "",
    ingredients: [],
    total_mins: 0,
    categories: [],
    calories: 0,
    veg_nonveg: "",
    daytimeofcooking: "",
    season: [],
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Assuming allRecipes is an array of recipes with `recipeId` as a unique identifier
        const recipe = allRecipes.find(
          (recipe) => recipe.recipeid === recipeId
        );
        if (recipe) {
          setFormData({
            title: recipe.title || "",
            img: recipe.img || "",
            video: recipe.video || "",
            ingredients: recipe.ingredients || [],
            total_mins: recipe.total_mins || 0,
            categories: recipe.categories || [],
            calories: recipe.calories || 0,
            veg_nonveg: recipe.veg_nonveg || "",
            daytimeofcooking: recipe.daytimeofcooking || "",
            season: recipe.season || [],
          });
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        // Handle error fetching recipe details
      }
    };

    fetchRecipe();
  }, [recipeId, allRecipes]);

  const handleGoBack = () => {
    window.location.href = "/user/addedrecipes";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const isChecked = checked;
      const currentValue = formData[name];
      let newValue;

      if (isChecked) {
        newValue = [...currentValue, value];
      } else {
        newValue = currentValue.filter((item) => item !== value);
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your update logic here
    console.log("Form Data:", formData);
    // Example: Update API call
    // try {
    //   const response = await axios.put(`http://localhost:8000/recipe/edit/${recipeId}`, formData);
    //   console.log("Recipe updated:", response.data);
    //   // Redirect or show success message
    // } catch (error) {
    //   console.error("Error updating recipe:", error);
    //   // Handle error
    // }
  };

  return (
    <div>
      <Navbar />
      <hr />
      <div className="add-recipe-head">
        <div className="back-arrow" onClick={handleGoBack}>
          <IoMdArrowRoundBack />
        </div>
        <div className="add-recipe-heading">Edit Recipe</div>
        <div className="add-recipe-btns">
          <button className="save-btn" type="submit" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
      <hr />
      <div className="add-recipe-form">
        <div className="add-recipe-form-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Recipe Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="img">Image URL:</label>
              <input
                type="text"
                id="img"
                name="img"
                value={formData.img}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="video">Video URL:</label>
              <input
                type="text"
                id="video"
                name="video"
                value={formData.video}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ingredients">Ingredients:</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients.join("\n")}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="total_mins">Total Minutes:</label>
              <input
                type="number"
                id="total_mins"
                name="total_mins"
                value={formData.total_mins}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categories">Categories:</label>
              <select
                id="categories"
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleChange}
              >
                {/* Option values */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="calories">Calories:</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="veg_nonveg">Vegetarian/Non-vegetarian:</label>
              <select
                id="veg_nonveg"
                name="veg_nonveg"
                value={formData.veg_nonveg}
                onChange={handleChange}
              >
                {/* Option values */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="daytimeofcooking">Daytime of Cooking:</label>
              <select
                id="daytimeofcooking"
                name="daytimeofcooking"
                value={formData.daytimeofcooking}
                onChange={handleChange}
              >
                {/* Option values */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="season">Season:</label>
              {/* Checkbox options */}
            </div>
            <div className="form-group">
              {formData.season.map((season) => (
                <label key={season}>
                  <input
                    type="checkbox"
                    name="season"
                    value={season}
                    checked={formData.season.includes(season)}
                    onChange={handleChange}
                  />{" "}
                  {season}
                </label>
              ))}
            </div>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditRecipe;
