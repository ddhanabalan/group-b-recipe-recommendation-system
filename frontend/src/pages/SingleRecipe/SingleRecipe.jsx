import React, { useContext, useEffect } from "react";
import { RecipeContext } from "../../context/recipeContext";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import Breadcrums from "../../components/breadcrums/Breadcrums";
import RecommendedRecipes from "../../components/recommendedRecipes/RecommendedRecipes";
import Reviews from "../../components/reviews/Reviews";
import RatingAndReviewBox from "../../components/ratingAndReviewBox/RatingAndReviewBox";
import { isAuthenticated } from "../../utils/auth";

const SingleRecipe = () => {
  const { all_recipe } = useContext(RecipeContext);
  const { RecipeId } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const recipeId = Number(RecipeId);
  const recipe = all_recipe.find((e) => e.id === recipeId);

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login page using navigate("/login")
      navigate("/login");
    }
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <Navbar />
      <Breadcrums recipe={recipe} />
      <RecipeDisplay recipe={recipe} />
      <RatingAndReviewBox />
      <Reviews />
      <RecommendedRecipes />
      <Footer />
    </div>
  );
};

export default SingleRecipe;
