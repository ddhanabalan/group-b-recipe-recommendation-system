import React from "react";
import { useNavigate } from "react-router-dom";
import UserSideBar from "../../components/userSideBar/UserSideBar";
import Navbar from "../../components/Navbar/Navbar";
import AddedItems from "../../components/addedItems/AddedItems";
import Footer from "../../components/Footer/Footer";
import "../../styles/User.css";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const UserAddedRecipes = () => {
  const history = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== "user") {
      history("/login");
    }
  }, [history]);

  return (
    <div>
      <Navbar />
      <div className="usercontainer">
        <div className="usersidebar">
          <UserSideBar />
        </div>
        <div className="user-content-section">
          <div className="user-content-heading">
            <div className="heading">
              <h2>Added Recipes</h2>
            </div>
            <div className="btn">
              <button className="add-new-recipe">
                <Link
                  to="/addnewrecipe"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <IoAdd
                    style={{
                      fontSize: 17,
                      paddingRight: 5,
                    }}
                  />
                  Add New Recipe
                </Link>
              </button>
            </div>
          </div>
          <hr style={{ width: 0 }} />
          <div className="user-content-item">
            <AddedItems />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAddedRecipes;
