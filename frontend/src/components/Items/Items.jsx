import React from "react";
import "../../styles/Items.css";

import StarRating from "../starRating/StarRating";
import { Link } from "react-router-dom";
const Items = (props) => {
  return (
    <div className="item">
      <Link to={`/singlerecipe/${props.id}`}>
        <img src={props.imageurl} alt="recipe" className="img" />
      </Link>
      <h3>{props.title}</h3>
      <div className="items-details">
        <div className="mins">
          <b>{props.total_mins}</b> mins
        </div>

        <div className="calories">
          <b>{props.calorie} </b> Calorie
        </div>
      </div>
      <div className="item-rating">
        <b style={{ paddingTop: 2.5, paddingRight: 5 }}>{props.ratings} </b>
        <StarRating stars={props.ratings} />
      </div>
    </div>
  );
};

export default Items;
