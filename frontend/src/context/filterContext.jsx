import React, { createContext, useReducer } from "react";

const FilterContext = createContext();

const initialState = {
  searchQuery: "",
  category: [],
  maxTime: null,
  maxCalories: null,
  vegNonVeg: null,
  season: null,
  timeOfDay: null,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, ...action.payload };
    case "RESET_FILTER":
      return initialState;
    default:
      return state;
  }
};

const FilterContextProvider = ({ children }) => {
  const [filter, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext, FilterContextProvider };
