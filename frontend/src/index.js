import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { RecipeContextProvider } from "./context/recipeContext";

import { SortProvider } from "./context/sortContext";
import { FilterContextProvider } from "./context/filterContext";
import { SearchProvider } from "./context/searchContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecipeContextProvider>
    <SortProvider>
      <FilterContextProvider>
        <App />
        <ToastContainer position="top-center" />
      </FilterContextProvider>
    </SortProvider>
  </RecipeContextProvider>
);
