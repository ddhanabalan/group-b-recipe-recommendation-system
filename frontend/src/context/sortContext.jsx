import React, { createContext, useContext, useState } from "react";

const SortContext = createContext();

export const useSortContext = () => {
  return useContext(SortContext);
};

export const SortProvider = ({ children }) => {
  const [sortOption, setSortOption] = useState("default"); // default sort option

  const sortRecipes = (option) => {
    setSortOption(option);
  };

  const sortFunction = (a, b) => {
    switch (sortOption) {
      case "lowestCalorie":
        return a.calories - b.calories;
      case "highestRating":
        return b.rating - a.rating;
      case "alphabeticalAsc":
        return a.title.localeCompare(b.title);
      case "alphabeticalDesc":
        return b.title.localeCompare(a.title);
      case "leasttime":
        return a.total_mins - b.total_mins;
      default:
        return 0;
    }
  };

  return (
    <SortContext.Provider value={{ sortOption, sortRecipes, sortFunction }}>
      {children}
    </SortContext.Provider>
  );
};
