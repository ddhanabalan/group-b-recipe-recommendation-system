import React from "react";
import { PiHamburgerDuotone } from "react-icons/pi";
import { IoFishOutline } from "react-icons/io5";
import { LuDessert } from "react-icons/lu";
import { BiBowlHot } from "react-icons/bi";
import { CiFries } from "react-icons/ci";
import { PiBowlFood } from "react-icons/pi";
import { LuSalad } from "react-icons/lu";
import { RiCake2Line } from "react-icons/ri";
import "../../styles/TopCategories.css";

const TopRecipeCategories = () => {
  const recipeCategoriesData = [
    { id: 1, name: "Appetizers", icon: CiFries },
    { id: 2, name: "Main Dishes", icon: PiHamburgerDuotone },
    { id: 3, name: "Side Dishes", icon: PiBowlFood },
    { id: 4, name: "Seafoods", icon: IoFishOutline },
    { id: 5, name: "Desserts", icon: LuDessert },
    { id: 6, name: "Soups", icon: BiBowlHot },
    { id: 7, name: "Salads", icon: LuSalad },
    { id: 8, name: "Cakes", icon: RiCake2Line },
  ];

  return (
    <div className="top-categories">
      <h1>Top Categories</h1>
      <div className="category-list">
        {recipeCategoriesData.map((category) => (
          <div key={category.id} className="category-box">
            <category.icon size={40} style={{ marginBottom: 10 }} />
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRecipeCategories;
