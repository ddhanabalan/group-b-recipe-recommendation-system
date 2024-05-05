import React, { useContext, useEffect } from "react";
import { RecipeContext } from "../../context/recipeContext";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import RecommendedRecipes from "../../components/recommendedRecipes/RecommendedRecipes";
import Reviews from "../../components/reviews/Reviews";
import RatingAndReviewBox from "../../components/ratingAndReviewBox/RatingAndReviewBox";

const SingleRecipe = () => {
  const { allRecipes, loading, error } = useContext(RecipeContext);
  const { RecipeId } = useParams();

  useEffect(() => {
    console.log("All Recipes:", allRecipes);
  }, [allRecipes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const recipe =
    allRecipes && allRecipes.length > 0
      ? allRecipes.find((e) => e.id === Number(RecipeId))
      : [];

  if (!recipe) {
    console.log(`Recipe with ID ${RecipeId} not found.`);
    return <div>Error: Recipe not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <Breadcrumbs recipe={recipe} />
      <RecipeDisplay recipe={recipe} />
      <RatingAndReviewBox />
      <Reviews />
      <RecommendedRecipes />
      <Footer />
    </div>
  );
};

export default SingleRecipe;
