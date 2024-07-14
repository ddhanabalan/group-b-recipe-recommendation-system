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
  getUserId,
} from "../../utils/auth";
import { useParams } from "react-router-dom";

const EditRecipe = () => {
  const { recipeId } = useParams();
  const { distinctCategories, distinctSeasons, distinctDayOfTimeCooking } =
    useContext(RecipeContext);

  const [formData, setFormData] = useState({
    title: "",
    img: "",
    video: "",
    thumbnail: "",
    ingredients: "",
    total_mins: 0,
    categories: [],
    calories: 0,
    veg_nonveg: "veg",
    daytimeofcooking: "",
    season: [],
  });

  const [initialData, setInitialData] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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
          thumbnail: recipeData.thumbnail || "",
          ingredients: recipeData.ingredients
            ? JSON.parse(recipeData.ingredients).join("\n")
            : "",
          total_mins: recipeData.total_mins || 0,
          categories: recipeData.categories || [],
          calories: recipeData.calories || 0,
          veg_nonveg: recipeData.veg_nonveg || "veg",
          daytimeofcooking: recipeData.daytimeofcooking || "",
          season: recipeData.season ? recipeData.season.split("/") : [],
        });
        setInitialData({
          title: recipeData.title || "",
          img: recipeData.img || "",
          video: recipeData.video || "",
          thumbnail: recipeData.thumbnail || "",
          ingredients: recipeData.ingredients
            ? JSON.parse(recipeData.ingredients).join("\n")
            : "",
          total_mins: recipeData.total_mins || 0,
          categories: recipeData.categories || [],
          calories: recipeData.calories || 0,
          veg_nonveg: recipeData.veg_nonveg || "veg",
          daytimeofcooking: recipeData.daytimeofcooking || "",
          season: recipeData.season ? recipeData.season.split("/") : [],
        });

        if (recipeData.img) {
          setPhotoPreview(recipeData.img);
        }

        if (recipeData.video) {
          setVideoPreview(recipeData.video);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        if (error.response && error.response.status === 401) {
          await handleTokenRefreshAndRetry(fetchData);
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch recipe data. Please try again later.",
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
      const newValues = checked
        ? [...formData[name], value]
        : formData[name].filter((item) => item !== value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValues,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleMediaChange = async (e, type) => {
    const file = e.target.files[0];
    console.log(`Uploading ${type}:`, file);
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "image") {
      setPhotoPreview(previewUrl);
      setImgFile(file);
    } else if (type === "video") {
      setVideoPreview(previewUrl);
      setVideoFile(file);
    }

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
      console.log(`Response from ${type} upload:`, response.data);
      const mediaUrl = response.data;
      if (type === "image") {
        setFormData((prevData) => ({
          ...prevData,
          img: mediaUrl,
        }));
        setUploadingImage(false);
      } else if (type === "video") {
        setFormData((prevData) => ({
          ...prevData,
          video: mediaUrl,
        }));
        setUploadingVideo(false);

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
            console.log(`Thumbnail upload response:`, thumbnailResponse.data);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = getAuthToken();
      const seasonsString = formData.season.join("/");
      const ingredientsString = JSON.stringify(
        formData.ingredients.split("\n")
      );

      const dataToSend = new FormData();
      const changes = {};

      if (formData.title !== initialData.title) {
        dataToSend.append("title", formData.title);
        changes.title = formData.title;
      }
      if (formData.img !== initialData.img) {
        dataToSend.append("img", formData.img);
        changes.img = formData.img;
      }
      if (formData.video !== initialData.video) {
        dataToSend.append("video", formData.video);
        changes.video = formData.video;
      }
      if (formData.thumbnail !== initialData.thumbnail) {
        dataToSend.append("thumbnail", formData.thumbnail);
        changes.thumbnail = formData.thumbnail;
      }
      if (formData.ingredients !== initialData.ingredients) {
        dataToSend.append("ingredients", ingredientsString);
        changes.ingredients = ingredientsString;
      }
      if (formData.total_mins !== initialData.total_mins) {
        dataToSend.append("total_mins", formData.total_mins);
        changes.total_mins = formData.total_mins;
      }
      if (formData.categories !== initialData.categories) {
        dataToSend.append("categories", formData.categories);
        changes.categories = formData.categories;
      }
      if (formData.calories !== initialData.calories) {
        dataToSend.append("calories", formData.calories);
        changes.calories = formData.calories;
      }
      if (formData.veg_nonveg !== initialData.veg_nonveg) {
        dataToSend.append("veg_nonveg", formData.veg_nonveg);
        changes.veg_nonveg = formData.veg_nonveg;
      }
      if (formData.daytimeofcooking !== initialData.daytimeofcooking) {
        dataToSend.append("daytimeofcooking", formData.daytimeofcooking);
        changes.daytimeofcooking = formData.daytimeofcooking;
      }
      if (seasonsString !== initialData.season.join("/")) {
        dataToSend.append("season", seasonsString);
        changes.season = seasonsString;
      }

      console.log("Data to be sent:", Object.fromEntries(dataToSend));

      const response = await axios.post(
        `http://localhost:8000/recipe/editrecipe/`,
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );

      console.log("Response from edit recipe:", response.data);

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Recipe updated successfully!",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update recipe. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      if (error.response && error.response.status === 401) {
        await handleTokenRefreshAndRetry(handleSubmit);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update recipe. Please try again later.",
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
            Update
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
              <label htmlFor="img">Recipe Image:</label>
              <input
                type="file"
                name="img"
                accept="image/*"
                onChange={(e) => handleMediaChange(e, "image")}
              />
              {uploadingImage && <p>Uploading image...</p>}
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Recipe Preview"
                  className="photo-preview"
                  style={{ width: "30%" }}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="video">Recipe Video:</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={(e) => handleMediaChange(e, "video")}
              />
              {uploadingVideo && <p>Uploading video...</p>}
              {videoPreview && (
                <video
                  src={videoPreview}
                  style={{ width: "30%" }}
                  controls
                  className="video-preview"
                />
              )}
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
                  if (e.code === "Minus" || e.key === "-" || e.key === ".") {
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
