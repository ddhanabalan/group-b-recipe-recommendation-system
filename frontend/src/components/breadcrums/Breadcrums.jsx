import React from "react";
import "../../styles/Breadcrums.css";
import { IoIosArrowForward } from "react-icons/io";
const Breadcrums = (props) => {
  const { recipe } = props;
  return (
    <div className="breadcrum">
      Home
      <IoIosArrowForward
        style={{ fontSize: 15, paddingRight: 5, paddingLeft: 5 }}
      />
      Recipes
      <IoIosArrowForward
        style={{ fontSize: 15, paddingRight: 5, paddingLeft: 5 }}
      />
      {recipe.title}
    </div>
  );
};

export default Breadcrums;
