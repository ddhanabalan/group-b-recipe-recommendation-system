import React, { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/AddNewRecipe.css";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import { IoMdArrowRoundBack } from "react-icons/io";

const AddNewRecipe = () => {
  const handleGoBack = () => {
    window.location.href = "/user/addedrecipes";
  };

  const [formData, setFormData] = useState({
    title: "",
    imageurl: null,
    ingredients: [],
    total_mins: 0,
    categories: [],
    calorie: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      total_mins:
        name === "hours" || name === "minutes"
          ? calculateTotalMins(prevData)
          : prevData.total_mins,
    }));
  };

  const calculateTotalMins = (data) => {
    const hours = parseInt(data.hours) || 0;
    const minutes = parseInt(data.minutes) || 0;
    return hours * 60 + minutes;
  };

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

  const handleSubmit = (e) => {
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

    // Show SweetAlert confirmation
    Swal.fire({
      title: "Are you sure you want to save this recipe?",
      text: "Once saved, you cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform save action (you can replace this with your actual save logic)
        console.log("Recipe saved:", formData);

        // Show success message

        Swal.fire({
          title: "Saved!",
          text: "Your recipe has been saved.",
          icon: "success",
          confirmButtonText: "OK",
          icon: null, // Set the icon to null to make it none
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
      }
    });
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
                </div>
                <div className="image-container">
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
