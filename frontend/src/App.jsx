import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//importing pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Recipe from "./pages/Recipe/Recipe";
import SingleRecipe from "./pages/SingleRecipe/SingleRecipe";
import Admin from "./pages/admin/Admin";
import UserSavedRecipes from "./pages/User/UserSavedRecipes";
import UsersList from "./pages/admin/UsersList";
import UserAddedRecipes from "./pages/User/UserAddedRecipes";
import UserFeedback from "./pages/User/UserFeedback";
import UserProfile from "./pages/User/UserProfile";
import AddNewRecipe from "./pages/User/AddNewRecipe";
import EditProfile from "./pages/User/EditProfile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import Otp from "./pages/Otp/Otp";
import ReviewsList from "./pages/admin/ReviewsList";
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
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/reviews" element={<ReviewsList />} />
          <Route path="/user/savedrecipes" element={<UserSavedRecipes />} />
          <Route path="/user/addedrecipes" element={<UserAddedRecipes />} />
          <Route path="/user/feedbacks" element={<UserFeedback />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/addnewrecipe" element={<AddNewRecipe />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/otp/:email" element={<Otp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
