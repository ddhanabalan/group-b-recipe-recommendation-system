import React, { useState, useContext, useEffect, useRef } from "react";
import "../../styles/Navbar.css";
import logo_dark from "../../assets/logo.svg";
import { Search } from "@mui/icons-material";
import { RecipeContext } from "../../context/recipeContext";
import {
  isAuthenticated,
  getAuthToken,
  clearAuthToken,
} from "../../utils/auth";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { allRecipes } = useContext(RecipeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const storedToken = getAuthToken();

  useEffect(() => {
    console.log("Stored Token:", storedToken);
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

  const handleRecipeClick = (recipeId, recipeTitle) => {
    console.log("Redirecting to Recipe ID:", recipeId);
    if (!isAuthenticated()) {
      window.location.href = "/login"; // Redirect to the login page
      return;
    }

    window.location.href = `/singlerecipe/${recipeId}`;

    setSearchHistory((prevHistory) => [
      ...prevHistory,
      { id: recipeId, title: recipeTitle },
    ]);
    sessionStorage.setItem(
      "searchHistory",
      JSON.stringify([...searchHistory, { id: recipeId, title: recipeTitle }])
    );
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/authentication/logout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });
      setShowDropdown(false);
      setSearchHistory([]); // Clear search history when logging out
      sessionStorage.removeItem("searchHistory");
      clearAuthToken(); // Clear the authentication token
      window.location.href = "/home";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
                    onClick={() => setSearchTerm(item)}
                  >
                    {item.title}
                  </li>
                ))}
              </div>
              <div>
                {filteredRecipes.map((recipe) => (
                  <li
                    key={recipe.id}
                    className="search-item"
                    onClick={() => handleRecipeClick(recipe.id, recipe.title)}
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
                    key={recipe.id}
                    className="search-item"
                    onClick={() => handleRecipeClick(recipe.id, recipe.title)}
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
                  User
                </span>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
