import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { getAuthToken } from "../utils/auth";

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

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const token = getAuthToken();

      if (!token) {
        // User is not logged in, set default state or handle accordingly
        // console.log("No authentication token found. Skipping user preferences fetch.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/authentication/userpreferences/",
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );

        const userPreferences = response.data;
        // console.log("Fetched User Preferences:", userPreferences);

        dispatch({
          type: "SET_FILTER",
          payload: {
            vegNonVeg:
              userPreferences.food_type?.toLowerCase() === "any"
                ? null
                : userPreferences.food_type,
          },
        });
      } catch (error) {
        // console.error("Error fetching user preferences:", error);
      }
    };

    fetchUserPreferences();
  }, []);

  return (
    <FilterContext.Provider value={{ filter, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext, FilterContextProvider };
