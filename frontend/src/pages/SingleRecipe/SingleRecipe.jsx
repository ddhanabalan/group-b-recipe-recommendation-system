import React, { useContext } from "react";
import { RecipeContext } from "../../context/recipeContext";
import { useParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import RecipeDisplay from "../../components/recipeDisplay/RecipeDisplay";
import Breadcrums from "../../components/breadcrums/Breadcrums";
import RecommendedRecipes from "../../components/recommendedRecipes/RecommendedRecipes";
import Reviews from "../../components/reviews/Reviews";
import RatingAndReviewBox from "../../components/ratingAndReviewBox/RatingAndReviewBox";

const SingleRecipe = () => {
  const { value } = useContext(RecipeContext);
  const { RecipeId } = useParams();
  const recipeId = Number(RecipeId);
  //console.log("va:", value);
  //console.log("recipeId", recipeId);
  const recipe = value.find((e) => {
    //console.log("e.id", e.id, typeof e.id);
    //console.log("recipeId", recipeId, typeof recipeId);
    return e.id === recipeId;
  });
  //console.log("recipe:", recipe);
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
