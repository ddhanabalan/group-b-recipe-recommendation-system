import React from "react";
import Carousel, { consts } from "react-elastic-carousel";
import Item from "../Items/Items";
import "../../styles/CarouselComponent.css";
import { TfiArrowCircleLeft } from "react-icons/tfi";
import { TfiArrowCircleRight } from "react-icons/tfi";
function myArrow({ type, onClick, isEdge }) {
  const pointer =
    type === consts.PREV ? <TfiArrowCircleLeft /> : <TfiArrowCircleRight />;
  return (
    <button
      onClick={onClick}
      disabled={isEdge}
      style={{
        background: "none",
        outline: "none",
        border: "none",
        fontSize: 30,
      }}
    >
      {pointer}
    </button>
  );
}
const CarouselComponent = ({ data }) => {
  return (
    <Carousel
      itemsToShow={3}
      focusOnSelect={true}
      itemPadding={[10, 50]}
      renderArrow={myArrow}
    >
      {data.map((item, i) => (
        <Item
          key={i}
          recipeid={item.recipeid}
          title={item.title}
          img={item.img}
          total_mins={item.total_mins}
          calories={item.calories}
          rating={item.rating}
        />
      ))}
    </Carousel>
  );
};
export default CarouselComponent;
