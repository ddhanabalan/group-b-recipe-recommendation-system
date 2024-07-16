import React, { useState, useContext, useEffect, useRef } from "react";
import "../../styles/Navbar.css";
import logo_dark from "../../assets/logo.svg";
import { Search } from "@mui/icons-material";
import { RecipeContext } from "../../context/recipeContext";
import {
  isAuthenticated,
  getAuthToken,
  clearAuthData,
  getUserName,
  getUserId,
  refreshAccessToken,
} from "../../utils/auth";
import axios from "axios";

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function Navbar() {
  const { allRecipes } = useContext(RecipeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [lastSelectedRecipe, setLastSelectedRecipe] = useState(null);
  const searchRef = useRef(null);
  const [open, setOpen] = useState(false);
  const username = getUserName();

  useEffect(() => {
    const storedSearchHistory = sessionStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      sessionStorage.removeItem("searchHistory");
    };
  }, []);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleSearchClick = (event) => {
    event.stopPropagation();
    setShowDropdown(true);
  };

  const handleSearch = debounce((term) => {
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
  }, 300);

  const handleInputChange = (e) => {
    const term = e.target.value.trim();
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim().length > 0) {
      setSearchTerm("");
    }
  };

  const handleRecipeClick = async (recipeid, recipeTitle) => {
    try {
      if (isAuthenticated()) {
        let authToken = getAuthToken();
        const userId = getUserId();

        if (!authToken) {
          authToken = await refreshAccessToken();
        }

        const searchData = {
          userid: userId,
          search_text: recipeTitle,
        };
        //console.log("reciep titles passing :", searchData);
        const response = await axios.post(
          "http://localhost:8000/recipe/addsearchhistory/",
          searchData,
          {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
              "Content-Type": "application/json",
            },
          }
        );

        const updatedHistory = [
          ...searchHistory.filter((item) => item.id !== recipeid),
          { id: recipeid, title: recipeTitle },
        ];
        setSearchHistory(updatedHistory);
        sessionStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }

      setLastSelectedRecipe(recipeTitle);
      setShowDropdown(false);
      window.location.href = `/singlerecipe/${recipeid}`;
    } catch (error) {
      console.error("Error adding search history:", error);

      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = "/login";
      } else {
        console.error("Failed to add search history. Please try again later.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        "http://localhost:8000/authentication/logout/",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      clearAuthData();
      window.location.href = "/login";
    } catch (error) {
      if (error.response && error.response.status === 401) {
        clearAuthData();
        window.location.href = "/login";
      } else {
        console.error("Error logging out:", error);
      }
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const authToken = isAuthenticated();

  return (
    <div className="navbar">
      <div className="left">
        <div className="search-bar-container" ref={searchRef}>
          <input
            type="text"
            placeholder="Search a recipe.."
            className="search-bar"
            onClick={handleSearchClick}
            onChange={handleInputChange}
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
                <span
                  className="user-heading"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={toggleDropdown}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#e49963";
                    e.target.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "black";
                    e.target.style.textDecoration = "none";
                  }}
                >
                  <b> {username ? username.toUpperCase() : "User"}</b>
                </span>
                {open && (
                  <ul className="dropdown-menu">
                    <li>
                      <a href="/user/savedrecipes" className="dropdown-link">
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="/changepassword" className="dropdown-link">
                        Change Password
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-link"
                        style={{
                          border: "none",
                          background: "none",
                          color: "black",
                          fontSize: "12px",
                          padding: "10px 20px",
                          cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                  onClick={() => (window.location.href = "/login")}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#e49963";
                    e.target.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "black";
                    e.target.style.textDecoration = "none";
                  }}
                >
                  Login
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
