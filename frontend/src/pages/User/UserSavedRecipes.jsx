import React from "react";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import "../../styles/User.css";
import SavedItems from "../../components/savedItems/SavedItems";
import Footer from "../../components/Footer/Footer";

const UserSavedRecipes = () => {
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
