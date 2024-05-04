import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/Herosection/Herosection";
import CarouselComponent from "../../components/Carouselcomponent/Carouselcomponent";
import Footer from "../../components/Footer/Footer";
import TopCategories from "../../components/Topcategories/Topcategories";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import joinpic from "../../assets/joinnowpic.jpg";
import "../../styles/Home.css";

// dummymmy data

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
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      {/*popular recipes section*/}
      <div className="popularrecipe">
        <h1>Popular Recipes</h1>
        <div className="new-slider">
          <CarouselComponent data={recipeData} />
        </div>
      </div>
      {/*top categories section*/}
      <TopCategories />
      {/*new recipes section*/}
      <div className="newrecipe">
        <h1>
          <b style={{ fontFamily: "serif" }}>What's</b> New!
        </h1>
        <div className="new-slider">
          <CarouselComponent data={recipeData} />
        </div>
      </div>
      {/*Why choose section*/}
      <div className="whychooseus">
        <h1>
          Why Choose{" "}
          <p
            style={{
              fontFamily: "serif",
              color: "#DD7D38",
              paddingLeft: 4,
              paddingRight: 2,
            }}
          >
            Us
          </p>
          ?
        </h1>
        <div className="features">
          <div className="feature">
            <div className="icon">
              <FastfoodIcon
                style={{ paddingLeft: 5, fontSize: 50, color: "#f0a068" }}
              />
            </div>
            <h2>1200+ Recipes</h2>
            <p>
              Tailor your culinary journey with us, offering a diverse selection
              of over 1500 recipes to suit your unique tastes and preferences.
            </p>
          </div>
          <div className="feature">
            <div className="icon">
              <RestaurantIcon style={{ fontSize: 50, color: "#f0a068" }} />
            </div>
            <h2>20+ Categories</h2>
            <p>
              Explore a world of flavors with our extensive collection of 20+
              categories, ensuring there's a perfect recipe for every craving
              and occasion.
            </p>
          </div>
          <div className="feature">
            <div className="icon">
              <SupervisedUserCircleRoundedIcon
                style={{ fontSize: 50, color: "#f0a068" }}
              />
            </div>
            <h2>150+ Happy Users</h2>
            <p>
              Join our community of culinary enthusiasts with over 150+ happy
              users, discovering joy in every delicious recipe and shared
              culinary experience.
            </p>
          </div>
        </div>
      </div>
      {/*Join now section */}
      <div className="joinnow">
        <div className="joinnow-left">
          <h1>DON'T MISS A THING</h1>
          <h3>EXPLORE MORE RECIPES AND MAKE YOUR LIFE EASIER.</h3>
          <p>
            Unlock a world of culinary delights by creating an account with us
            today – your gateway to personalized recipe collections, exclusive
            content, and a community of fellow food enthusiasts.
          </p>
          <Link to="/Signup">
            <button>Join Now</button>
          </Link>
        </div>
        <div className="joinnow-right">
          <img src={joinpic} alt="join with us" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
