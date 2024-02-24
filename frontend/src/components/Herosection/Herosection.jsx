import React from "react";
import "./Herosection.css";

import { Link } from "react-router-dom";

function Herosection() {
  return (
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
  );
}

export default Herosection;
