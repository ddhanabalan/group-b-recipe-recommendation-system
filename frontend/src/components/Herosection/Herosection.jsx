import React from "react";
import { Link } from "react-router-dom";
import "./Herosection.css";
function Herosection() {
  return (
    <div className="hero">
      <div className="left-heading">
        <h1>Hello,</h1>
        <h1>Are you Hungry?</h1>
        <p>
          Providing various easy-to-follow recipes from all over the world.Learn
          how to make your cooking tastier and easier with us!
        </p>
        <Link to="/recipe">
          <button>Explore All Recipes</button>
        </Link>
      </div>
    </div>
  );
}

export default Herosection;
