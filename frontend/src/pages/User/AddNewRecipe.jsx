// Import necessary dependencies
import React, { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/AddNewRecipe.css";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
const AddNewRecipe = () => {
  const handleGoBack = () => {
    window.location.href = "/user/addedrecipes";
  };
  const token = localStorage.getItem("authToken");
  // State variables
  const [formData, setFormData] = useState({
    title: "",
    imageurl: null,
    ingredients: [],
    total_mins: 0,
    categories: [],
    calorie: "",
    nonVeg: false, // Added non-veg/veg selection
    timeOfDay: "", // Added time of cooking selection
    seasons: [], // Added season selection
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (type === "radio") {
      // For radio buttons, update the value directly
      newValue = value === "true"; // Convert "true" to boolean true, "false" to boolean false
    } else if (type === "checkbox") {
      // Handle checkbox inputs for arrays
      const isChecked = checked;
      const currentValue = formData[name];
      if (isChecked) {
        newValue = [...currentValue, value]; // Add the checked value to the array
      } else {
        newValue = currentValue.filter((item) => item !== value); // Remove the unchecked value from the array
      }
    }

    // Update form data state
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
      total_mins:
        name === "hours" || name === "minutes"
          ? calculateTotalMins(prevData)
          : prevData.total_mins,
    }));
  };

  // Calculate total minutes for cooking time
  const calculateTotalMins = (data) => {
    const hours = parseInt(data.hours) || 0;
    const minutes = parseInt(data.minutes) || 0;
    return hours * 60 + minutes;
  };

  // Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      imageurl: URL.createObjectURL(file),
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      categories: selectedCategories,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const hours = parseInt(formData.hours) || 0;
    const minutes = parseInt(formData.minutes) || 0;
    const total_mins = hours * 60 + minutes;
    setFormData((prevData) => ({
      ...prevData,
      total_mins: total_mins,
    }));

    delete formData.hours;
    delete formData.minutes;
    console.log(formData);
    try {
      // Send the request with Axios
      const response = await axios.post(
        "http://your-api-endpoint.com/add-new-recipe",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      console.log("Recipe saved:", response.data);

      // Show success message
      Swal.fire({
        title: "Saved!",
        text: "Your recipe has been saved.",
        icon: "success",
        confirmButtonText: "OK",
        icon: null,
      });
      // Clear form fields for adding a new recipe
      setFormData({
        title: "",
        imageurl: formData.imageurl, // Keep the image URL here
        ingredients: [],
        total_mins: 0,
        categories: [],
        calorie: "",
      });
      setPhotoPreview("");
      setShowPreview(false);
    } catch (error) {
      console.error("Error saving recipe:", error);

      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Failed to save the recipe. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        icon: null,
      });
    }
  };
  // Handle showing recipe preview
  const handleShowPreview = () => {
    setShowPreview(true);
  };

  // Handle editing recipe
  const handleEdit = () => {
    setShowPreview(false);
  };

  return (
    <div>
      <Navbar />
      <hr />
      <div className="add-recipe-head">
        <div className="back-arrow" onClick={handleGoBack}>
          <IoMdArrowRoundBack />
        </div>
        <div className="add-recipe-heading">Create new recipe</div>
        <div className="add-recipe-btns">
          {!showPreview && (
            <button className="preview-btn" onClick={handleShowPreview}>
              Preview
            </button>
          )}
          {showPreview && (
            <>
              <button className="save-btn" type="submit" onClick={handleSubmit}>
                Save
              </button>
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      <hr />
      <div className="add-recipe-form">
        <div className="add-recipe-form-content">
          {showPreview ? (
            <div>
              <RecipeDisplay recipe={formData} />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div>
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
                {/* Non-Veg or Veg Selection */}
                <div className="nonveg-section">
                  <label>Non-Veg or Veg:</label>
                  <label>
                    <input
                      type="radio"
                      name="nonVeg"
                      id="nonveg"
                      value="true"
                      checked={formData.nonVeg}
                      onChange={handleChange}
                    />
                    Non-Veg
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="nonVeg"
                      id="veg"
                      value="false"
                      checked={!formData.nonVeg}
                      onChange={handleChange}
                    />
                    Veg
                  </label>
                </div>
                {/* Time of Cooking Selection */}
                <div className="time-cooking">
                  <label htmlFor="timeOfDay">Time of Cooking:</label>
                  <select
                    id="timeOfDay"
                    name="timeOfDay"
                    value={formData.timeOfDay}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Time of Cooking</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                {/* Season Selection */}
                <div className="season-section">
                  <label>Season:</label>
                  <label>
                    <input
                      type="checkbox"
                      name="seasons"
                      id="summer"
                      value="summer"
                      checked={formData.seasons.includes("summer")}
                      onChange={handleChange}
                    />
                    Summer
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="seasons"
                      id="winter"
                      value="winter"
                      checked={formData.seasons.includes("winter")}
                      onChange={handleChange}
                    />
                    Winter
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="seasons"
                      value="autumn"
                      id="autumn"
                      checked={formData.seasons.includes("autumn")}
                      onChange={handleChange}
                    />
                    Autumn
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="seasons"
                      value="spring"
                      id="spring"
                      checked={formData.seasons.includes("spring")}
                      onChange={handleChange}
                    />
                    Spring
                  </label>
                </div>
                <div className="image-portion">
                  <label htmlFor="imageurl">Upload Photo:</label>
                  <input
                    type="file"
                    id="imageurl"
                    name="imageurl"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    required
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Chosen"
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                    />
                  )}
                </div>
                <div className="ingredient-container">
                  <label htmlFor="ingredients">Ingredients:</label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients.join(", ")}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        ingredients: e.target.value
                          .split(/\s*,\s*/)
                          .filter((ingredient) => ingredient.trim() !== ""), // Split and filter out empty strings
                      }))
                    }
                    required
                    placeholder="Enter ingredients separated by commas"
                  />
                </div>
                <div>
                  <label htmlFor="hours">Cooking Time (Hours):</label>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="minutes">Cooking Time (Minutes):</label>
                  <input
                    type="number"
                    id="minutes"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div></div>
                <div className="category-container">
                  <label htmlFor="categories">Category:</label>
                  <select
                    id="categories"
                    name="categories"
                    multiple
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="calorie">Calories:</label>
                  <input
                    type="number"
                    id="calorie"
                    name="calorie"
                    value={formData.calorie}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddNewRecipe;
