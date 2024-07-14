import React, { useState, useEffect, useContext } from "react";
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
import { getUserId, isAuthenticated } from "../../utils/auth";
import "../../styles/Home.css";
import { RecipeContext } from "../../context/recipeContext";

function Home() {
  const { loading, error } = useContext(RecipeContext);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [newRecipes, setNewRecipes] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const authToken = isAuthenticated();
  const userid = getUserId();
  useEffect(() => {
    fetch("http://localhost:8000/recipe/popularrecipes/")
      .then((response) => response.json())
      .then((data) => setPopularRecipes(data))
      .catch((error) =>
        console.error("Error fetching popular recipes:", error)
      );

    // Fetch new recipes from the new recipes API endpoint
    fetch("http://localhost:8000/recipe/newrecipes/")
      .then((response) => response.json())
      .then((data) => setNewRecipes(data))
      .catch((error) => console.error("Error fetching new recipes:", error));

    fetch("http://localhost:8000/recommend/userrecommend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: userid }),
    })
      .then((response) => response.json())
      .then((data) => setRecommendedRecipes(data))
      .catch((error) =>
        console.error("Error fetching recommended recipes:", error)
      );
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <Navbar />
      <HeroSection />
      {/*recommend for user  section*/}
      {authToken && (
        <div className="recommendedrecipe">
          <div className="recommended-container">
            <div className="justforyou-heading">
              <h2>Daily Recommendations</h2>
            </div>
            <div className="slider-container new-slider">
              <CarouselComponent data={recommendedRecipes} />
            </div>
          </div>
        </div>
      )}
      {/*popular recipes section*/}
      <div className="popularrecipe">
        <h1>Popular Recipes</h1>
        <div className="new-slider">
          <CarouselComponent data={popularRecipes} />
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
          <CarouselComponent data={newRecipes} />
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
      {authToken ? (
        <></>
      ) : (
        <>
          <div className="joinnow">
            <div className="joinnow-left">
              <h1>DON'T MISS A THING</h1>
              <h3>EXPLORE MORE RECIPES AND MAKE YOUR LIFE EASIER.</h3>
              <p>
                Unlock a world of culinary delights by creating an account with
                us today – your gateway to personalized recipe collections,
                exclusive content, and a community of fellow food enthusiasts.
              </p>
              <Link to="/Signup">
                <button>Join Now</button>
              </Link>
            </div>
            <div className="joinnow-right">
              <img src={joinpic} alt="join with us" />
            </div>
          </div>
        </>
      )}
      {/*Footer section */}
      <Footer />
    </div>
  );
}

export default Home;
