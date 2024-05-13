import React, { useContext, useEffect, useState } from "react";
import { RecipeContext } from "../../context/recipeContext";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import Breadcrums from "../../components/breadcrums/Breadcrums";
import RecommendedRecipes from "../../components/recommendedRecipes/RecommendedRecipes";
import Reviews from "../../components/reviews/Reviews";
import RatingAndReviewBox from "../../components/ratingAndReviewBox/RatingAndReviewBox";
import { isAuthenticated } from "../../utils/auth";
const SingleRecipe = () => {
  const { allRecipes, loading, error } = useContext(RecipeContext);
  const { RecipeId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/recipe/recipereview/",
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

    fetchReviews();
  }, [RecipeId]);
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return;
  }
  if (loading || reviewsLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (reviewsError) {
    return <div>Error fetching reviews: {reviewsError}</div>;
  }

  const recipe =
    allRecipes && allRecipes.length > 0
      ? allRecipes.find((e) => e.recipeid === Number(RecipeId))
      : [];

  if (!recipe) {
    console.log(`Recipe with ID ${RecipeId} not found.`);
    return <div>Error: Recipe not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <Breadcrums recipe={recipe} />
      <RecipeDisplay recipe={recipe} />
      <RatingAndReviewBox recipeId={recipe.recipeid} />
      <Reviews reviews={reviews} />
      <RecommendedRecipes />
      <Footer />
    </div>
  );
};

export default SingleRecipe;
