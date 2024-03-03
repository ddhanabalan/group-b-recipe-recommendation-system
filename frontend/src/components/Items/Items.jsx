import React from "react";
import "./Items.css";
import LensIcon from "@mui/icons-material/Lens";
const Items = (props) => {
  return (
    <div className="item">
      <img src={props.imageurl} alt="recipe" className="img" />
      <h3>{props.title}</h3>
      <div className="items-details">
        <div className="mins">
          <b>{props.total_mins}</b> mins
        </div>
        <t>
          <LensIcon
            style={{
              fontSize: 5,
            }}
          />
        </t>
        <div className="calories">
          <b>{props.calorie} </b> Calorie
        </div>
      </div>
      <div className="item-rating">
        <b>{props.ratings}</b> Rating
      </div>
    </div>
  );
};

export default Items;
