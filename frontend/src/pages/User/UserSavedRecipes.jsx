import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import SavedItems from "../../components/savedItems/SavedItems";
import Footer from "../../components/Footer/Footer";
import { isAuthenticated, getUserRole } from "../../utils/auth";
import "../../styles/User.css";

const UserSavedRecipes = () => {
  const history = useNavigate();

  if (!isAuthenticated() || getUserRole() !== "user") {
    history("/login");
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="usercontainer">
        <div className="usersidebar">
          <UserSideBar />
        </div>
        <div className="user-content-section">
          <div className="user-content-heading">
            <h2>Saved Recipes</h2>
            <hr style={{ border: "none" }} />
          </div>
          <div className="user-content-item">
            <SavedItems />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserSavedRecipes;
