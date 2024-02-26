import React from "react";
import "./Popularrecipes.css";
import Items from "../Items/Items";
import Carousel from "react-elastic-carousel";

/*{
  const breakPoints = [
  {
    width: 1,
    itemsToShow: 1,
  },
  {
    width: 558,
    itemsToShow: 2,
  },
  {
    width: 768,
    itemsToShow: 3,
  },
  {
    width: 1200,
    itemsToShow: 3,
  },
]
}*/

export const Popularrecipes = () => {
  return (
    <div className="popular">
      <h1>Popular Recipes</h1>
      <div className="popularitem">
        <Carousel
          infinite={true}
          itemsToShow={3}
          pagination={false}
          initialActiveIndex={3}
        >
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
          <Items />
        </Carousel>
      </div>
    </div>
  );
};

export default Popularrecipes;
