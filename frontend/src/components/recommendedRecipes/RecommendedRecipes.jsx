import React, { useEffect, useState } from "react";
import axios from "axios";
import CarouselComponent from "../Carouselcomponent/Carouselcomponent";
import "../../styles/RecommendedRecipes.css";

const RecommendedRecipes = ({ recipeId }) => {
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("recipeid:", recipeId);
    const fetchRecommendedRecipes = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/recommend/reciperecommend/",
          { recipeid: recipeId }
        );
        // console.log("response from api :", response.data);
        setRecipeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error response from API:", error.response.data);
        setError(
          "Failed to fetch recommended recipes. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchRecommendedRecipes();
  }, [recipeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recommendedrecipes">
      <h1>Looking For Something else?</h1>
      <div className="recommenderecipe_carousel">
        <CarouselComponent className="recomended_carousel" data={recipeData} />
      </div>
    </div>
  );
};

export default RecommendedRecipes;
