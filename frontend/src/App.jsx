import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//importing pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Recipe from "./pages/recipe/Recipe";
import SingleRecipe from "./pages/SingleRecipe/SingleRecipe";
import Admin from "./pages/admin/Admin";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/SingleRecipe/:RecipeId" element={<SingleRecipe />} />
          <Route path="/dashboard" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
