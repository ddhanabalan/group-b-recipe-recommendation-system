// filterContext.js
import React, { createContext, useReducer } from "react";

const initialState = {
  filter: {
    category: [],
    maxTime: 0,
    maxCalories: 0,
    searchQuery: "",
  },
};

const FilterContext = createContext(initialState);

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "RESET_FILTER":
      return initialState;
    default:
      return state;
  }
};

const FilterContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  return (
    <FilterContext.Provider value={{ filter: state.filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext, FilterContextProvider };
