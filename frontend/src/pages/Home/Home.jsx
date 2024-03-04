import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Herosection from "../../components/Herosection/Herosection";
import Topcategories from "../../components/Topcategories/Topcategories";
import Footer from "../../components/Footer/Footer";
import "../../pages/Home/Home.css";
import Carouselcomponent from "../../components/Carouselcomponent/Carouselcomponent";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import joinpic from "../../assets/joinnowpic.jpg";

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
    calorie: 728,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
    category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

    ratings: 4.7,
    reviews: 23,
    title: "Chef John's Carrot Cake",
    total_mins: 95,
  },
  {
    id: 3,
    calorie: 728,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
    category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

    ratings: 4.7,
    reviews: 23,
    title: "Chef John's Carrot Cake",
    total_mins: 95,
  },
  {
    id: 4,
    calorie: 728,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
    category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

    ratings: 4.7,
    reviews: 23,
    title: "Chef John's Carrot Cake",
    total_mins: 95,
  },
  {
    id: 5,
    calorie: 728,
    imageurl:
      "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
    category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

    ratings: 4.7,
    reviews: 23,
    title: "Chef John's Carrot Cake",
    total_mins: 95,
  },
];
function Home() {
  return (
    <div>
      <Navbar />
      <Herosection />
      {/*popular recipes section*/}
      <div className="popularrecipe">
        <h1>Popular Recipes</h1>
        <div className="new-slider">
          <Carouselcomponent data={recipeData} />
        </div>
      </div>
      {/*top categories section*/}
      <Topcategories />
      {/*new recipes section*/}
      <div className="newrecipe">
        <h1>
          <b style={{ fontFamily: "serif" }}>What's</b> New!
        </h1>
        <div className="new-slider">
          <Carouselcomponent data={recipeData} />
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
              <FastfoodIcon style={{ fontSize: 50, color: "#f0a068" }} />
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
