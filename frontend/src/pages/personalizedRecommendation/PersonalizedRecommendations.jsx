import React, { useState, useEffect } from "react";
import "../../styles/PersonalizedRecommendation.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const cuisines = [
  "Asian",
  "African",
  "Brazilian",
  "Belgian",
  "Chinese",
  "English",
  "European",
  "French",
  "Filipino",
  "Indian",
  "Indonesian",
  "Irish",
  "Italian",
  "Korean",
  "Latin American",
  "Middle Eastern",
  "Mexican",
  "Persian",
  "Spanish",
  "South American",
  "Scandinavian",
  "Thai",
  "Turkish",
  "UK and Ireland",
];

const PersonalizedRecommendationPage = () => {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const userPreferences =
      JSON.parse(localStorage.getItem("userPreferences")) || {};
    console.log(
      "preference at recommendation page:",
      localStorage.getItem("userPreferences")
    );
    if (
      !userPreferences.preference ||
      userPreferences.preference.length === 0
    ) {
      setStep(1); // Preference is either undefined or an empty array
    } else if (!userPreferences.food_type) {
      setStep(2); // Only food_type is not set
    } else {
      navigate("/home"); // Both preferences are set, navigate to home page
    }
  }, [navigate]);

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const selectDietaryPreference = (preference) => {
    setDietaryPreference(preference);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (selectedCuisines.length === 0) {
      alert("Please select at least one cuisine.");
      return;
    }

    const userPreferences =
      JSON.parse(localStorage.getItem("userPreferences")) || {};
    userPreferences.preference = selectedCuisines;
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

    // API call for preference
    axiosInstance
      .post("/authentication/addpreference/", {
        preference: selectedCuisines,
      })
      .then(() => {
        setStep(2); // Move to dietary preference page
      })
      .catch((error) => {
        console.error("Error saving preference:", error);
        // Handle error appropriately, show error message or retry logic
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dietaryPreference === "") {
      alert("Please select a dietary preference or click Skip.");
      return;
    }

    const userPreferences =
      JSON.parse(localStorage.getItem("userPreferences")) || {};
    userPreferences.food_type = dietaryPreference;
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

    // API call for food_type
    axiosInstance
      .post("/authentication/addfoodtype/", {
        food_type: dietaryPreference,
      })
      .then(() => {
        navigate("/home"); // Navigate to home page after successful submission
      })
      .catch((error) => {
        console.error("Error saving dietary preference:", error);
        // Handle error appropriately, show error message or retry logic
      });
  };

  const handleSkipStep = () => {
    const userPreferences =
      JSON.parse(localStorage.getItem("userPreferences")) || {};

    if (step === 1) {
      userPreferences.preference = []; // Set preference to empty array
      localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

      if (userPreferences.food_type) {
        navigate("/home"); // Dietary preference already set, navigate to home
      } else {
        setStep(2); // Move to dietary preference page
      }
    } else {
      userPreferences.food_type = "non-veg"; // Set food_type to "non-veg"
      localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
      navigate("/home"); // Skip dietary preference selection step and navigate to home
    }
  };

  return (
    <div className="recommendation-page">
      <div className="recommendation-background"></div>
      <div className="recommendation-container">
        <div className="personalized-recommendation">
          <h2>Personalize Your Experience</h2>
          <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
            {step === 1 && (
              <>
                <label>What are your favorite cuisines?</label>
                <div className="cuisine-options">
                  {cuisines.map((cuisine) => (
                    <div
                      key={cuisine}
                      className={`cuisine-item ${
                        selectedCuisines.includes(cuisine) ? "selected" : ""
                      }`}
                      onClick={() => toggleCuisine(cuisine)}
                    >
                      {cuisine}
                    </div>
                  ))}
                </div>
                <div className="button-container">
                  <button
                    className="recommendation-btn"
                    type="button"
                    onClick={handleSkipStep}
                    style={{ marginRight: "10px" }}
                  >
                    Skip
                  </button>
                  <button className="recommendation-btn" type="submit">
                    Next
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <label>Do you prefer veg or non-veg?</label>
                <div className="dietary-options">
                  <div
                    className={`dietary-item ${
                      dietaryPreference === "veg" ? "selected" : ""
                    }`}
                    onClick={() => selectDietaryPreference("veg")}
                  >
                    Veg
                  </div>
                  <div
                    className={`dietary-item ${
                      dietaryPreference === "non-veg" ? "selected" : ""
                    }`}
                    onClick={() => selectDietaryPreference("non-veg")}
                  >
                    Non-Veg
                  </div>
                  <div
                    className={`dietary-item ${
                      dietaryPreference === "any" ? "selected" : ""
                    }`}
                    onClick={() => selectDietaryPreference("any")}
                  >
                    Any
                  </div>
                </div>
                <div className="button-container">
                  <button
                    className="recommendation-btn"
                    type="button"
                    onClick={handleSkipStep}
                    style={{ marginRight: "10px" }}
                  >
                    Skip
                  </button>
                  <button className="recommendation-btn" type="submit">
                    Submit
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendationPage;
