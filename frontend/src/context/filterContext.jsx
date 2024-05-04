import React, { createContext, useReducer } from "react";

const initialState = {
  category: [],
  maxTime: Infinity,
  maxCalories: Infinity,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET_FILTER":
      return initialState;
    default:
      return state;
  }
};

const FilterContext = createContext();

const FilterContextProvider = ({ children }) => {
  const [filter, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext, FilterContextProvider, initialState };
