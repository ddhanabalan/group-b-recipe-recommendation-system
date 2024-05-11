// Import necessary dependencies
import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/AddNewRecipe.css";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { RecipeContext } from "../../context/recipeContext";
const AddNewRecipe = () => {
  const { distinctCategories } = useContext(RecipeContext);
  const handleGoBack = () => {
    window.location.href = "/user/addedrecipes";
  };
  const token = localStorage.getItem("authToken");
  // State variables

  const [formData, setFormData] = useState({
    title: "",
    img: null,
    ingredients: [],
    total_mins: 0,
    categories: [],
    calories: 0,
    veg_nonveg: "",
    daytimeofcooking: "",
    season: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
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

      // Update form data state for checkbox inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          [name]: value,
        };

        // Calculate total_mins based on hours and minutes if either of them changes
        if (name === "hours" || name === "minutes") {
          const hours = name === "hours" ? value : newData.hours;
          const minutes = name === "minutes" ? value : newData.minutes;
          newData.total_mins = calculateTotalMins(hours, minutes);
        }

        return newData;
      });
    }
  };

  const calculateTotalMins = (hours, minutes) => {
    const parsedHours = parseInt(hours) || 0;
    const parsedMinutes = parseInt(minutes) || 0;
    return parsedHours * 60 + parsedMinutes;
  };

  // Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      img: URL.createObjectURL(file),
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleCategoryChange = (e) => {
    const { name, value, checked } = e.target;

    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        categories: prevData.categories.filter((cat) => cat !== value),
      }));
    }
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
        img: formData.img, // Keep the image URL here
        ingredients: [],
        total_mins: 0,
        categories: [],
        calories: 0,
        veg_nonveg: "",
        daytimeofcooking: "",
        season: "",
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
                  <label htmlFor="veg_nonveg">Nonveg or Veg :</label>
                  <select
                    id="veg_nonveg"
                    name="veg_nonveg"
                    value={formData.veg_nonveg}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select nonveg or veg</option>
                    <option value="nonveg(turkey)">nonveg(turkey)</option>
                    <option value="veg(egg)">veg(egg)</option>
                    <option value="veg">veg</option>
                  </select>
                </div>
                {/* Time of Cooking Selection */}
                <div className="time-cooking">
                  <label htmlFor="daytimeofcooking">Time of Cooking:</label>
                  <select
                    id="daytimeofcooking"
                    name="daytimeofcooking"
                    value={formData.daytimeofcooking}
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
                  <label htmlFor="season">Season:</label>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Season</option>
                    <option value="summer">summer</option>
                    <option value="winter">winter</option>
                    <option value="fall">fall</option>
                  </select>
                </div>

                <div className="image-portion">
                  <label htmlFor="img">Upload Photo:</label>
                  <input
                    type="file"
                    id="img"
                    name="img"
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
                        ingredients: e.target.value.split(/,\s*/),
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

                <div>
                  <label htmlFor="minutes">Cooking Time (Minutes):</label>
                  <input
                    type="number"
                    id="minutes"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    onKeyDown={(e) => {
                      if (
                        e.code === "Minus" ||
                        e.key === "-" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
                    required
                  />
                </div>

                <div></div>
                <div className="category-section">
                  <label htmlFor="categories">Category:</label>
                  <div className="category-part">
                    {distinctCategories.map((category) => (
                      <label key={category} className="category-label">
                        <input
                          type="checkbox"
                          name="categories"
                          value={category}
                          onChange={handleCategoryChange}
                          checked={formData.categories.includes(category)}
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="calories">Calories:</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={formData.calorie}
                    onChange={handleChange}
                    min="0"
                    onKeyDown={(e) => {
                      if (
                        e.code === "Minus" ||
                        e.key === "-" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
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
