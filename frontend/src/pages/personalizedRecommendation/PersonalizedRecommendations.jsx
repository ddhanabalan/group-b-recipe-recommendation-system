import React, { useState } from "react";
import "../../styles/PersonalizedRecommendation.css";
import { useNavigate } from "react-router-dom";

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
  const [step, setStep] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState("");
  const navigate = useNavigate();

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
    if (step === 1) {
      setStep(2);
    } else {
      console.log("Selected cuisines:", selectedCuisines);
      console.log("Dietary preference:", dietaryPreference);
      navigate("/home");
    }
  };

  return (
    <div className="recommendation-page">
      <div className="recommendation-background"></div>
      <div className="recommendation-container">
        <div className="personalized-recommendation">
          <h2>Personalize Your Experience</h2>
          <form onSubmit={handleNextStep}>
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
              </>
            )}
            {step === 2 && (
              <>
                <label>Do you prefer veg or non-veg ?</label>
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
              </>
            )}
            <button type="submit">{step === 1 ? "Next" : "Submit"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendationPage;
