import React from "react";
import CarouselComponent from "../carouselComponent/CarouselComponent";
import "../../styles/RecommendedRecipes.css";
//dummy data
const recipeData = [
  {
    id: 1,
    calorie: 728,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
    category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],
    ingredients: [
      "2 cups all-purpose flour",
      "1 teaspoon salt",
      "1 teaspoon baking soda",
      "2 teaspoons baking powder",
      "1/2 teaspoon ground ginger",
      "2 teaspoons ground",
    ],
    ratings: 4.7,
    reviews: 23,
    title: "Chef John's Carrot Cake",
    total_mins: 95,
  },
  {
    id: 2,
    calorie: 692,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/6517017.jpg",
    category: ["Bread", "Yeast Bread"],
    ingredients: [
      "1/2 cup warm milk",
      "1/3 cup warm water",
      "1 1/2 teaspoons white sugar",
      "1 (.25 ounce) package active dry yeast",
      "2 teaspoons olive oil",
      "2 1/4 cups all-purpose flour, divided",
      "1 1/2 teaspoons kosher salt",
      "4 ounces",
    ],
    ratings: 4.6,
    reviews: 2,
    title: "Khachapuri (Georgian Cheese Bread)",
    total_mins: 115,
  },
  {
    id: 3,
    calorie: 505,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/6493093.jpg",
    category: ["Everyday Cooking", "Vegetarian", "Side Dishes"],
    ingredients: [
      "2 cups whole milk",
      "1 teaspoon kosher salt, or more to taste",
      "1 pinch cayenne pepper",
      "1 pinch dried mustard (optional)",
      "1 very small pinch ground nutmeg",
      "3 tablespoons unsalted butter, divided",
      "1 cup elbow",
    ],
    ratings: 4.3,
    reviews: 9,
    title: "Instant Mac and Cheese",
    total_mins: 28,
  },
  {
    id: 4,
    calorie: 471,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/4572704.jpg",
    category: ["World Cuisine", "European", "Italian"],
    ingredients: [
      "4 skinless, boneless chicken breast halves",
      "salt and freshly ground black pepper to taste",
      "2 eggs",
      "1 cup panko bread crumbs, or more as needed",
      "1/2 cup grated Parmesan cheese",
      "2 tablespoons all-purpose flour, or more if needed",
      "1 cup olive oil for frying",
      "1/2 cup prepared tomato sauce",
      "1/4 cup fresh mozzarella, cut into small cubes",
      "1/4 cup chopped fresh basil",
      "1/2 cup grated provolone cheese",
      "1/4 cup grated Parmesan cheese",
      "1 tablespoon olive oil",
    ],
    ratings: 4.8,
    reviews: 2000,
    title: "Chicken Parmesan",
    total_mins: 45,
  },
];
const RecommendedRecipes = () => {
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
