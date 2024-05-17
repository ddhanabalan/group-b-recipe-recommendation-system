import React from "react";
import { Link } from "react-router-dom";
import "../../styles/HeroSection.css";
import { isAuthenticated } from "../../utils/auth";
function HeroSection() {
  const authToken = isAuthenticated();
  return (
    <div className="hero">
      <div className="hero_left-heading">
        {authToken ? (
          <>
            <h1>Welcome Back,</h1>
            <h1>Feeling Hungry?</h1>
          </>
        ) : (
          <>
            <h1>Hello,</h1>
            <h1>Are you Hungry?</h1>
          </>
        )}
        <p>
          Providing various easy-to-follow recipes from all over the world.
          Learn how to make your cooking tastier and easier with us!
        </p>
        <div className="hero_left-btn">
          <Link to="/recipe">
            <button>Explore All Recipes</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
