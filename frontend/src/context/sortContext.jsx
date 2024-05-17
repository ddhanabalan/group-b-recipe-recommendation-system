import React, { createContext, useContext, useState } from "react";

const SortContext = createContext();

export const useSortContext = () => useContext(SortContext);

export const SortProvider = ({ children }) => {
  const [sortOption, setSortOption] = useState("");
  const sortRecipes = (option) => {
    setSortOption(option);
  };
  // Inside SortContext.js

  const sortFunction = (a, b) => {
    console.log("Sorting by:", sortOption); // Log the current sorting option
    switch (sortOption) {
      case "lowestCalorie":
        console.log("Sorting by lowest calorie");
        return a.calories - b.calories;
      case "highestRating":
        console.log("Sorting by highest rating");
        return b.rating - a.rating;
      case "alphabeticalAsc":
        console.log("Sorting by alphabetical order (A-Z)");
        return a.title.localeCompare(b.title);
      case "alphabeticalDesc":
        console.log("Sorting by alphabetical order (Z-A)");
        return b.title.localeCompare(a.title);
      case "leasttime":
        console.log("Sorting by least time");
        return a.total_mins - b.total_mins;
      default:
        console.log("Default sorting");
        return a.recipeid - b.recipeid;
    }
  };

  return (
    <SortContext.Provider value={{ sortOption, sortFunction, sortRecipes }}>
      {children}
    </SortContext.Provider>
  );
};

export default SortContext;
