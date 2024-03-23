import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { RecipeContextProvider } from "./context/recipeContext";
import { UserReviewContextProvider } from "./context/userReviewContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecipeContextProvider>
    <UserReviewContextProvider>
      <App />
    </UserReviewContextProvider>
  </RecipeContextProvider>
);
