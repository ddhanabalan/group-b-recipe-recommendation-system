import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { RecipeContext } from "../../context/recipeContext";
import {
  getAuthToken,
  getUserId,
  clearAuthData,
  refreshAccessToken,
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
    video: "",
    ingredients: [],
    total_mins: 0,
    categories: [],
    calories: 0,
    veg_nonveg: "",
    daytimeofcooking: "",
    season: [],
    thumbnail: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    img: "",
    ingredients: "",
    veg_nonveg: "",
    daytimeofcooking: "",
    season: "",
    calories: "",
    total_mins: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentValue = formData[name];
      let newValue;

      if (checked) {
        newValue = [...currentValue, value];
      } else {
        newValue = currentValue.filter((item) => item !== value);
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      if (name === "calories" && value.length > 1 && value.startsWith("0")) {
        // If the value starts with '0' and has more than one digit, strip leading zeros
        setFormData((prevData) => ({
          ...prevData,
          [name]: parseInt(value, 10).toString(),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

      if (name === "hours" || name === "minutes") {
        const hours = name === "hours" ? value : formData.hours;
        const minutes = name === "minutes" ? value : formData.minutes;
        setFormData((prevData) => ({
          ...prevData,
          total_mins: calculateTotalMins(hours, minutes),
        }));
      }
    }
  };

  const calculateTotalMins = (hours, minutes) => {
    const parsedHours = parseInt(hours) || 0;
    const parsedMinutes = parseInt(minutes) || 0;
    return parsedHours * 60 + parsedMinutes;
  };

  const handleMediaChange = async (e, type) => {
    const file = e.target.files[0];
    console.log(`Uploading ${type}:`, file);
    type === "image" ? setUploadingImage(true) : setUploadingVideo(true);

    const formDataToSend = new FormData();
    formDataToSend.append(type, file);

    try {
      const response = await axios.post(
        "http://localhost:8000/recipe/upload/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const mediaUrl = response.data;
      //  console.log(`${type} upload response:`, response.data);
      if (type === "image") {
        setPhotoPreview(mediaUrl);
        setFormData((prevData) => ({
          ...prevData,
          img: mediaUrl,
        }));
        setUploadingImage(false);
      } else if (type === "video") {
        setVideoPreview(mediaUrl);
        setFormData((prevData) => ({
          ...prevData,
          video: mediaUrl,
        }));
        setUploadingVideo(false);

        // Generate thumbnail from video
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        videoElement.addEventListener("loadeddata", () => {
          videoElement.currentTime = 5;
        });
        videoElement.addEventListener("seeked", async () => {
          const canvas = document.createElement("canvas");
          canvas.width = 320;
          canvas.height = 180;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL("image/png");

          // Upload the thumbnail to the server
          const thumbnailFile = dataURLToFile(
            thumbnailDataUrl,
            "thumbnail.png"
          );
          const thumbnailFormData = new FormData();
          thumbnailFormData.append("image", thumbnailFile);

          try {
            const thumbnailResponse = await axios.post(
              "http://localhost:8000/recipe/upload/",
              thumbnailFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const thumbnailUrl = thumbnailResponse.data;
            // console.log(`Thumbnail upload response:`, thumbnailResponse.data);

            // Update formData with thumbnail URL
            setFormData((prevData) => ({
              ...prevData,
              thumbnail: thumbnailUrl,
            }));
          } catch (error) {
            console.error("Error uploading thumbnail:", error);
          }
        });
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      type === "image" ? setUploadingImage(false) : setUploadingVideo(false);
    }
  };

  const dataURLToFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

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
    e.preventDefault();
    const errors = {};

    if (!formData.title) errors.title = "Title is required.";
    if (!formData.img) errors.img = "Image is required.";
    if (!formData.ingredients.length)
      errors.ingredients = "Ingredients are required.";
    if (!formData.veg_nonveg)
      errors.veg_nonveg = "Please select Veg or Non-Veg.";
    if (!formData.daytimeofcooking)
      errors.daytimeofcooking = "Please select the time of cooking.";
    if (!formData.season.length)
      errors.season = "Please select at least one season.";
    if (!formData.calories) errors.calories = "Calories are required.";
    if (!formData.total_mins) errors.total_mins = "Minutes are required.";

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

    const { access: authToken } = getAuthToken();
    const userid = getUserId();
    const seasonsString = formData.season.join("/");

    const dataToSend = {
      title: formData.title,
      img: formData.img,
      ingredients: JSON.stringify(formData.ingredients),
      total_mins: formData.total_mins,
      categories: formData.categories,
      calories: formData.calories,
      veg_nonveg: formData.veg_nonveg,
      daytimeofcooking: formData.daytimeofcooking,
      season: seasonsString,
      userid: userid,
    };

    if (formData.video) {
      dataToSend.video = formData.video;
    }
    if (formData.thumbnail) {
      dataToSend.thumbnail = formData.thumbnail;
    }

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

      //  console.log("Recipe saved:", response.data);

      Swal.fire({
        title: "Saved!",
        text: "Your recipe has been saved successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/user/addedrecipes";
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAuthToken = await refreshAccessToken();
          const retryResponse = await axios.post(
            "http://localhost:8000/recipe/addrecipe/",
            dataToSend,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newAuthToken}`,
              },
            }
          );

          //console.log("Recipe saved:", retryResponse.data);

          Swal.fire({
            title: "Saved!",
            text: "Your recipe has been saved successfully.",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/user/addedrecipes";
          });
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          Swal.fire({
            title: "Unauthorized",
            text: "Your session has expired. Please log in again.",
            confirmButtonText: "OK",
          }).then(() => {
            clearAuthData();
            window.location.href = "/user/login";
          });
        }
      } else {
        console.error("Error saving recipe:", error);
        Swal.fire({
          title: "Error",
          text: "There was an error saving your recipe. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    }
  };
  const handleShowPreview = () => {
    console.log("Form Data:", formData);
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
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.season}
                    </span>
                  )}
                </div>
                {/* Image Upload */}
                <div className="form-group">
                  <label htmlFor="img">Recipe Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="img"
                    name="img"
                    onChange={(e) => handleMediaChange(e, "image")}
                  />
                  {validationErrors.img && (
                    <div className="error" style={{ color: "#f44336" }}>
                      {validationErrors.img}
                    </div>
                  )}
                  {uploadingImage ? (
                    <div>Uploading Image...</div>
                  ) : (
                    photoPreview && (
                      <div>
                        <img
                          src={photoPreview}
                          alt="Recipe"
                          className="preview-image"
                          style={{ width: "30%" }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="video">Recipe Video:</label>
                  <input
                    type="file"
                    accept="video/*"
                    id="video"
                    name="video"
                    onChange={(e) => handleMediaChange(e, "video")}
                  />
                  {/*  {validationErrors.video && (
                    <div className="error" style={{ color: "#f44336" }}>
                      {validationErrors.video}
                    </div>
                  )}*/}
                  {uploadingVideo ? (
                    <div>Uploading Video...</div>
                  ) : (
                    videoPreview && (
                      <div>
                        <video
                          controls
                          className="preview-video"
                          style={{ width: "30%" }}
                        >
                          <source src={videoPreview} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )
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
                  />{" "}
                  {validationErrors.minutes && (
                    <span className="error" style={{ color: "#f44336" }}>
                      {validationErrors.minutes}
                    </span>
                  )}
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
