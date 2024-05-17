import React, { createContext, useReducer } from "react";

const FilterContext = createContext();

const initialState = {
  searchQuery: "",
  category: [],
  maxTime: 120,
  maxCalories: 1000,
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, ...action.payload };
    case "RESET_FILTER":
      return initialState;
    case "TOGGLE_CATEGORY":
      const { category } = action.payload;
      const updatedCategories = state.category.includes(category)
        ? state.category.filter((cat) => cat !== category)
        : [...state.category, category];
      return { ...state, category: updatedCategories };
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
