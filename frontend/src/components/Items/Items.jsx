import React from "react";
import "./Items.css";
const Items = (props) => {
  return (
    <div className="item">
      <img src={props.imageurl} alt="recipe" className="img" />
      <h3>{props.title}</h3>
      <div className="items-details">
        <div className="mins">{props.total_mins} mins</div>
        <div className="calories">{props.calorie} Calorie</div>
      </div>
      <div className="item-rating">{props.ratings} Rating</div>
    </div>
  );
};

export default Items;
