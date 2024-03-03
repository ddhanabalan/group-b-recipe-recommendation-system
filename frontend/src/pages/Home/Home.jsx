import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Topcategories from "../../components/Topcategories/Topcategories";
//import Whychooseus from "../../components/Whychooseus/Whychooseus";
//import Joinnow from "../../components/Joinnow/Joinnow";
//import Customersays from "../../components/Customersays/Customersays";
//import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import "../../pages/Home/Home.css";
import Carouselcomponent from "../../components/Carouselcomponent/Carouselcomponent";

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
      {/*Hero section*/}
      <div className="hero">
        <div className="left">
          <div className="left-heading">
            <h1>Hello,</h1>
            <h1>Are you Hungry?</h1>
          </div>
          <div className="left-intro">
            <p>
              Providing various easy-to-follow recipes from all over the
              world.Learn how to make your cooking tastier and easier with us!
            </p>
          </div>
          <div className="btn">
            <Link to="/Recipe">
              <div className="button">Explore all Recipes</div>
            </Link>
          </div>
        </div>
      </div>
      {/*popular recipes section*/}
      <div className="popularrecipe">
        <h1>Popular Recipes</h1>
        <div className="new-slider">
          <Carouselcomponent data={recipeData} />
        </div>
      </div>
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
      {/*<Whychooseus />
      <Joinnow />
      <Customersays />
      <Footer />*/}
    </div>
  );
}

export default Home;
