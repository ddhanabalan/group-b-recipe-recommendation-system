import React, { useContext } from "react";
import { useSortContext } from "../../context/sortContext";

const Sort = () => {
  const { sortOption, sortRecipes } = useSortContext();

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    sortRecipes(selectedOption);
  };

  return (
    <div style={{ fontFamily: "serif", fontSize: 20, fontWeight: 300 }}>
      <form className="custom-form" action="#">
        <select
          name="sort"
          id="sort"
          className="sort-dropdown"
          style={{ padding: "8px 12px", marginBottom: 10 }}
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="default">Sort by</option>
          <option value="lowestCalorie">Calorie (low)</option>
          <option value="highestRating">Rating (high)</option>
          <option value="alphabeticalAsc">(a-z)</option>
          <option value="alphabeticalDesc">(z-a)</option>
          <option value="leasttime">Time (low)</option>
        </select>
      </form>
    </div>
  );
};

export default Sort;
