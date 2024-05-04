import React from "react";
import "../../styles/Items.css";
import LensIcon from "@mui/icons-material/Lens";
import StarRating from "../starRating/StarRating";
import { Link } from "react-router-dom";
const Items = (props) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  return (
    <div className="item" onClick={handleClick}>
      <Link
        to={`/singlerecipe/${props.recipeid}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <img src={props.img} alt="recipe" className="img" />

        <h3>{props.title}</h3>
        <div className="items-details">
          <div className="mins">
            <b>{props.total_mins}</b> mins
          </div>
          <div className="calories" style={{ paddingTop: 3 }}>
            <b>{props.calories} </b> Calorie
          </div>
        </div>
        <div className="item-rating">
          <b style={{ paddingTop: 2.5, paddingRight: 5 }}>{props.rating} </b>
          <StarRating stars={props.rating} />
        </div>
      </Link>
    </div>
  );
};

export default Items;
