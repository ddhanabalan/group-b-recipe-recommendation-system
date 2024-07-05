import React, { useState, useEffect, useContext } from "react";
import { RecipeContext } from "../../context/recipeContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/EditRecipe.css";
import {
  clearAuthData,
  getAuthToken,
  refreshAccessToken,
} from "../../utils/auth";
import { useParams } from "react-router-dom";

const EditRecipe = () => {
  const { recipeId } = useParams();
  const {
    allRecipes,
    distinctCategories,
    distinctSeasons,
    distinctDayOfTimeCooking,
  } = useContext(RecipeContext);
  const [formData, setFormData] = useState({
    title: "",
    img: "",
    video: "",
    ingredients: "",
    total_mins: 0,
    categories: [],
    calories: 0,
    veg_nonveg: "",
    daytimeofcooking: "",
    season: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = getAuthToken();
        const response = await axios.post(
          `http://localhost:8000/recipe/singlerecipe/`,
          {
            recipeid: recipeId,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
            },
          }
        );

        const recipeData = response.data;
        setFormData({
          title: recipeData.title || "",
          img: recipeData.img || "",
          video: recipeData.video || "",
          ingredients: recipeData.ingredients
            ? JSON.parse(recipeData.ingredients).join("\n")
            : "",
          total_mins: recipeData.total_mins || 0,
          categories: recipeData.categories || [],
          calories: recipeData.calories || 0,
          veg_nonveg: recipeData.veg_nonveg || "",
          daytimeofcooking: recipeData.daytimeofcooking || "",
          season: recipeData.season ? recipeData.season.split("/") : [],
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        if (error.response && error.response.status === 401) {
          await handleTokenRefreshAndRetry(fetchData);
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch recipe data. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };

    fetchData();
  }, [recipeId]);

  const handleTokenRefreshAndRetry = async (fetchDataFunc) => {
    try {
      await refreshAccessToken();
      await fetchDataFunc();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearAuthData();
      window.location.href = "/login";
    }
  };

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

    try {
      const authToken = getAuthToken();
      const seasonsString = formData.season.join("/");
      const dataToSend = {
        title: formData.title,
        img: formData.img,
        video: formData.video,
        ingredients: JSON.stringify(formData.ingredients.split("\n")),
        total_mins: formData.total_mins,
        categories: formData.categories,
        calories: formData.calories,
        veg_nonveg: formData.veg_nonveg,
        daytimeofcooking: formData.daytimeofcooking,
        season: seasonsString,
      };

      const response = await axios.put(
        `http://localhost:8000/recipe/edit/${recipeId}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      Swal.fire({
        title: "Saved!",
        text: "Your recipe has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/user/addedrecipes";
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      if (error.response && error.response.status === 401) {
        await handleTokenRefreshAndRetry(handleSubmit);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update the recipe. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div>
      <Navbar />
      <hr />
      <div className="edit-recipe-head">
        <div className="back-arrow" onClick={handleGoBack}>
          <IoMdArrowRoundBack />
        </div>
        <div className="edit-recipe-heading">Edit Recipe</div>
        <div className="edit-recipe-btns">
          <button className="save-btn" type="submit" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
      <hr />
      <div className="edit-recipe-form">
        <div className="edit-recipe-form-content">
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
            <div className="ingredient-container">
              <label htmlFor="ingredients">Ingredients:</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Enter ingredients separated by commas"
                style={{ width: "600px", height: "100px" }}
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
                min="0"
                step="1"
                onKeyDown={(e) => {
                  if (
                    e.code === "Minus" ||
                    e.key === "-" ||
                    e.key === "." ||
                    e.key === "0"
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter whole integers (e.g., 1, 2, 3), excluding zero"
                required
              />
            </div>
            <div className="category-section">
              <label htmlFor="categories">Category:</label>

              <div className="category-part">
                {distinctCategories.map((category) => (
                  <label key={category} className="category_label">
                    <input
                      id="catcheck"
                      type="checkbox"
                      name="categories"
                      value={category}
                      onChange={handleChange}
                      checked={formData.categories.includes(category)}
                    />
                    <span className="category-name">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="calories">Calories:</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="0"
                onKeyDown={(e) => {
                  if (e.code === "Minus" || e.key === "-" || e.key === ".") {
                    e.preventDefault();
                  }
                }}
                required
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
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-vegetarian</option>
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
                {distinctDayOfTimeCooking.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Season:</label>
              {distinctSeasons.map((season) => (
                <label key={season}>
                  <input
                    id="season-check"
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
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditRecipe;
