import React from "react";

const FilterSection = () => {
  return (
    <div className="filtersection">
      <h1
        style={{
          fontFamily: "serif",
          fontSize: 30,
          fontWeight: 300,
          paddingBottom: 10,
        }}
      >
        Filter Recipes:
      </h1>
      <div
        className="filtersection-box"
        style={{ gap: 10, padding: 10, backgroundColor: "#f7e1d1" }}
      >
        categories
        <br />
        total time
        <br />
        calories
      </div>
    </div>
  );
};

export default FilterSection;
