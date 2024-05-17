import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { RecipeContextProvider } from "./context/recipeContext";
import { UserReviewContextProvider } from "./context/userReviewContext";
import { SortProvider } from "./context/sortContext";
import { FilterContextProvider } from "./context/filterContext";
import { SearchProvider } from "./context/searchContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecipeContextProvider>
    <UserReviewContextProvider>
      <SortProvider>
        <App />
      </SortProvider>
    </UserReviewContextProvider>
  </RecipeContextProvider>
);
