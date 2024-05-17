import React, { useState, useContext, useEffect, useRef } from "react";
import "../../styles/Navbar.css";
import logo_dark from "../../assets/logo.svg";
import { Search } from "@mui/icons-material";
import { RecipeContext } from "../../context/recipeContext";
import { isAuthenticated, getAuthToken, clearAuthData } from "../../utils/auth";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { allRecipes } = useContext(RecipeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const storedToken = getAuthToken();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedSearchHistory = sessionStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }

    return () => {
      sessionStorage.removeItem("searchHistory"); // Clear search history when unmounting
    };
  }, []);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowDropdown(false); // Close search list if clicked outside search bar
    }
  };

  const handleSearchClick = (event) => {
    event.stopPropagation(); // Prevent click propagation to document
    setShowDropdown(true);
  };

  const handleSearch = (e) => {
    const term = e.target.value.trim();
    setSearchTerm(term);
    if (term) {
      setShowDropdown(true);
      const filteredRecipes = allRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRecipes(filteredRecipes);
    } else {
      setShowDropdown(false);
      setFilteredRecipes([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim().length > 0) {
      setSearchTerm("");
    }
  };

  const handleRecipeClick = (recipeid, recipeTitle) => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    // Redirect to the single recipe page
    window.location.href = `/singlerecipe/${recipeid}`;

    // Update search history in sessionStorage
    const updatedHistory = [
      ...searchHistory,
      { id: recipeid, title: recipeTitle },
    ];
    setSearchHistory(updatedHistory);
    sessionStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };
  {
    /*const handleLogout = async () => {
    try {
      // Call your logout API endpoint here
      const response = await fetch(
        "http://localhost:8000/authentication/logout/",
        {
          method: "POST", // Assuming your logout endpoint uses POST method
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      clearAuthToken();
      clearUserId();

      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };*/
  }
  const handleLogout = () => {
    clearAuthData();

    window.location.href = "/login";
  };
  const toggleDropdown = () => {
    setOpen(!open);
  };

  const authToken = isAuthenticated(); // Determine if the user is authenticated

  return (
    <div className="navbar">
      <div className="left">
        <div className="search-bar-container" ref={searchRef}>
          <input
            type="text"
            placeholder="Search a recipe.."
            className="search-bar"
            onClick={handleSearchClick}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            value={searchTerm}
          />
          <Search
            style={{
              color: "gray",
              fontSize: 16,
              position: "absolute",
              paddingLeft: 10,
            }}
          />
          {showDropdown && authToken && (
            <div className="search-history">
              <div>
                {searchHistory.map((item, index) => (
                  <li
                    key={index}
                    className="search-item-history"
                    onClick={() => handleRecipeClick(item.id, item.title)}
                  >
                    {item.title}
                  </li>
                ))}
              </div>
              <div>
                {filteredRecipes.map((recipe) => (
                  <li
                    key={recipe.recipeid}
                    className="search-item"
                    onClick={() =>
                      handleRecipeClick(recipe.recipeid, recipe.title)
                    }
                  >
                    {recipe.title}
                  </li>
                ))}
              </div>
            </div>
          )}
          {showDropdown && !authToken && (
            <div className="search-history">
              <div>
                {filteredRecipes.map((recipe) => (
                  <li
                    key={recipe.reciepid}
                    className="search-item"
                    onClick={() =>
                      handleRecipeClick(recipe.recipeid, recipe.title)
                    }
                  >
                    {recipe.title}
                  </li>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="center">
        <a href="/">
          <img src={logo_dark} alt="Logo" className="logo" />
        </a>
      </div>
      <div className="right">
        <nav>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/recipe">Recipes</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            {authToken ? (
              <li>
                <span className="user-heading" onClick={toggleDropdown}>
                  User
                </span>
                {open && (
                  <ul className="dropdown-menu">
                    <li>
                      <a href="/user/savedrecipes">Dashboard</a>
                    </li>
                    <li>
                      <a href="/passwordreset">Change Password</a>
                    </li>
                    <li>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          color: "black",
                          fontSize: "12px",
                          paddingLeft: 0,
                        }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li>
                <span
                  className="user-heading"
                  style={{
                    border: "2px dashed #e49963",
                    padding: " 8px 30px",
                    color: "black",
                  }}
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </span>
              </li>
            )}

            {/*{authToken ? (
              <li className="dropdown-container">
                <div
                  className="user-icon"
                  onClick={toggleDropdown}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <span className="user-heading">User</span>
                  {showDropdown && (
                    <ul className="dropdown">
                      <li>
                        <a href="/user/savedrecipes">Dashboard</a>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ) : (
              <li>
                <span
                  className="user-heading"
                  onClick={() => (window.location.href = "/login")}
                >
                  login
                </span>
              </li>
            )}*/}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
