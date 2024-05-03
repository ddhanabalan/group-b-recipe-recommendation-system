import React, { createContext, useContext, useState } from "react";

const SortContext = createContext();

export const useSortContext = () => useContext(SortContext);

export const SortProvider = ({ children }) => {
  const [sortOption, setSortOption] = useState("");
  const sortRecipes = (option) => {
    setSortOption(option);
  };
  const sortFunction = (a, b) => {
    switch (sortOption) {
      case "lowestCalorie":
        return a.calorie - b.calorie;
      case "highestRating":
        return b.ratings - a.ratings;
      case "alphabeticalAsc":
        return a.title.localeCompare(b.title);
      case "alphabeticalDesc":
        return b.title.localeCompare(a.title);
      case "leasttime":
        return a.total_mins - b.total_mins;
      default:
        return a.id - b.id;
    }
  };

  return (
    <SortContext.Provider value={{ sortOption, sortFunction, sortRecipes }}>
      {children}
    </SortContext.Provider>
  );
};

export default SortContext;
