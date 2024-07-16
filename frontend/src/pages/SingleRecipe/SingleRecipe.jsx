import React, { useContext, useEffect, useState } from "react";
import "../../styles/loading.css";
import { RecipeContext } from "../../context/recipeContext";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import Breadcrums from "../../components/breadcrums/Breadcrums";
import RecommendedRecipes from "../../components/recommendedRecipes/RecommendedRecipes";
import Reviews from "../../components/reviews/Reviews";
import RatingAndReviewBox from "../../components/ratingAndReviewBox/RatingAndReviewBox";
import VideoDisplay from "../../components/videoDisplay/VideoDisplay";
import { isAuthenticated } from "../../utils/auth";
import loadingGif from "../../assets/loading.gif";

const SingleRecipe = () => {
  const { RecipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/recipe/singlerecipe/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeid: RecipeId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        const data = await response.json();
        setRecipe(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/recipe/recipereviews/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeid: RecipeId }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
        setReviewsLoading(false);
      } catch (error) {
        setReviewsError(error.message);
        setReviewsLoading(false);
      }
    };

    fetchRecipe();
    fetchReviews();
  }, [RecipeId]);

  if (loading || reviewsLoading) {
    return (
      <div className="loader">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (reviewsError) {
    return <div>Error fetching reviews: {reviewsError}</div>;
  }

  if (!recipe) {
    console.log(`Recipe with ID ${RecipeId} not found.`);
    return <div>Error: Recipe not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <Breadcrums recipe={recipe} />
      <RecipeDisplay recipe={recipe} />
      <VideoDisplay recipe={recipe} />
      <RatingAndReviewBox recipeId={recipe.recipeid} />
      <Reviews reviews={reviews} />
      <RecommendedRecipes recipeId={recipe.recipeid} />
      <Footer />
    </div>
  );
};

export default SingleRecipe;
