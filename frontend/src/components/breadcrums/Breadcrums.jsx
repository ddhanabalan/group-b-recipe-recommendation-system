import React from "react";
import "../../styles/Breadcrums.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
const Breadcrums = (props) => {
  const { recipe } = props;
  return (
    <div className="breadcrum">
      <Link to={`/Home`} style={{ textDecoration: "none", color: "black" }}>
        Home
      </Link>
      <IoIosArrowForward
        style={{ fontSize: 15, paddingRight: 5, paddingLeft: 5 }}
      />
      <Link to={`/recipe`} style={{ textDecoration: "none", color: "black" }}>
        Recipes
      </Link>
      <IoIosArrowForward
        style={{ fontSize: 15, paddingRight: 5, paddingLeft: 5 }}
      />
      {recipe.title}
    </div>
  );
};

export default Breadcrums;
