import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "../../styles/RecipeCard.css";

const RecipeCard = ({ recipe, onRemove }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    onRemove(recipe.recipeId); // Assuming recipeId is a unique identifier
  };

  return (
    <div
      className="recipe-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="remove-user-button" onClick={handleRemove}>
        <FaTimes className="remove-icon" />
      </button>
      <Link
        to={`/singlerecipe/${recipe.recipeid}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <img src={recipe.img} alt={recipe.title} className="recipe-image" />
        <div className="recipe-title">{recipe.title}</div>
      </Link>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default RecipeCard;
