import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { RecipeContext } from "../../context/recipeContext";
import {
  clearAuthData,
  getAuthToken,
  getUserId,
  isAuthenticated,
} from "../../utils/auth";
import "../../styles/AddNewRecipe.css";

const AddNewRecipe = () => {
  const { distinctCategories, distinctSeasons, distinctDayOfTimeCooking } =
    useContext(RecipeContext);
  const handleGoBack = () => {
    window.location.href = "/user/addedrecipes";
  };

  const [formData, setFormData] = useState({
    title: "",
    img: "",
    ingredients: [],
    total_mins: 0,
    categories: [],
    calories: 0,
    veg_nonveg: "",
    daytimeofcooking: "",
    season: [],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const calculateTotalMins = (hours, minutes) => {
    const parsedHours = parseInt(hours) || 0;
    const parsedMinutes = parseInt(minutes) || 0;
    return parsedHours * 60 + parsedMinutes;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.url; // Assuming the response contains the URL
      setFormData((prevData) => ({
        ...prevData,
        img: imageUrl,
      }));
      setPhotoPreview(imageUrl);
      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadingImage(false);
    }
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

  const handleSubmit = async (e) => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    e.preventDefault();
    const errors = {};

    if (!formData.title) errors.title = "Title is required.";
    if (!formData.img) errors.img = "Image or video is required.";
    if (!formData.ingredients.length)
      errors.ingredients = "Ingredients are required.";
    if (!formData.veg_nonveg)
      errors.veg_nonveg = "Please select Veg or Non-Veg.";
    if (!formData.daytimeofcooking)
      errors.daytimeofcooking = "Please select the time of cooking.";
    if (!formData.season.length)
      errors.season = "Please select at least one season.";
    if (!formData.calories) errors.calories = "Calories are required";

    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      Swal.fire({
        title: "Validation Error",
        text: "Please fill all the required fields.",
        confirmButtonText: "OK",
      }).then(() => {
        setShowPreview(false);
      });
      return;
    }

    const hours = parseInt(formData.hours) || 0;
    const minutes = parseInt(formData.minutes) || 0;
    const total_mins = calculateTotalMins(hours, minutes);

    const authToken = getAuthToken();
    const userid = getUserId();
    const seasonsString = formData.season.join("/");
    const dataToSend = {
      ...formData,
      total_mins,
      userid,
      season: seasonsString,
      ingredients: JSON.stringify(formData.ingredients),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/addrecipe/",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 401) {
        clearAuthData();
        window.location.href = "/login";
        return;
      }

      Swal.fire({
        title: "Saved!",
        text: "Your recipe has been saved.",
        confirmButtonText: "OK",
      });

      setFormData({
        title: "",
        img: "",
        ingredients: [],
        total_mins: 0,
        categories: [],
        calories: 0,
        veg_nonveg: "",
        daytimeofcooking: "",
        season: [],
      });
      setPhotoPreview("");
      setShowPreview(false);
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving recipe:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to save the recipe. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

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
                  {validationErrors.title && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.title}
                    </span>
                  )}
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
                    <option value="nonveg">Non-veg</option>
                    <option value="veg">Veg</option>
                  </select>
                  {validationErrors.veg_nonveg && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.veg_nonveg}
                    </span>
                  )}
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
                    {distinctDayOfTimeCooking.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {validationErrors.daytimeofcooking && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.daytimeofcooking}
                    </span>
                  )}
                </div>
                {/* Season Selection */}
                <div className="season-section">
                  <label htmlFor="season">Season:</label>
                  <div className="season-part">
                    {distinctSeasons.map((season) => (
                      <label key={season} className="category_label">
                        <input
                          id="season-check"
                          type="checkbox"
                          name="season"
                          value={season}
                          onChange={handleChange}
                          checked={formData.season.includes(season)}
                        />
                        <span className="category_name">{season}</span>
                      </label>
                    ))}
                  </div>
                  {validationErrors.season && (
                    <span className="error">{validationErrors.season}</span>
                  )}
                </div>
                {/* Image Upload */}
                <div className="form-group">
                  <label htmlFor="img">Recipe Image or Video:</label>
                  <input
                    type="file"
                    id="img"
                    name="img"
                    onChange={handleFileChange}
                    required
                  />{" "}
                  {validationErrors.img && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.img}
                    </span>
                  )}
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Recipe Preview"
                      style={{ width: "100px", height: "100px" }}
                    />
                  )}
                </div>
                {/* ingredient section*/}
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
                    style={{ width: "600px", height: "100px" }}
                  />
                  {validationErrors.ingredients && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.ingredients}
                    </span>
                  )}
                </div>

                {/*cooking time section*/}
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
                {/*category section*/}
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
                          onChange={handleCategoryChange}
                          checked={formData.categories.includes(category)}
                        />
                        <span className="category-name">{category}</span>
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
                    value={formData.calories}
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
                  {validationErrors.calories && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.calories}
                    </span>
                  )}
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
