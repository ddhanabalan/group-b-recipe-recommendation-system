import React from "react";
import Slider from "react-slick";
import { PiHamburgerDuotone } from "react-icons/pi";
import { IoFishOutline } from "react-icons/io5";
import { LuDessert } from "react-icons/lu";
import { BiBowlHot } from "react-icons/bi";
import { CiFries } from "react-icons/ci";
import { PiBowlFood } from "react-icons/pi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Topcategories.css";
const TopRecipeCategoriesCarousel = () => {
  //dummy data
  const recipeCategoriesData = [
    { id: 1, name: "Appetizers", icon: CiFries },
    { id: 2, name: "Main Dishes", icon: PiHamburgerDuotone },
    { id: 3, name: "Side Dishes", icon: PiBowlFood },
    { id: 4, name: "Seafoods", icon: IoFishOutline },
    { id: 5, name: "Desserts", icon: LuDessert },
    { id: 6, name: "soups", icon: BiBowlHot },
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
    focusOnSelect: true,
    lazyLoad: true,
  };

  return (
    <div className="top-categories-carousel">
      <h1>Top Categories</h1>
      <div className="cat-slider">
        <Slider {...settings}>
          {recipeCategoriesData.map((category) => (
            <div key={category.id}>
              <div className="category-box">
                <category.icon size={40} style={{ marginRight: 5 }} />
                <p>{category.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopRecipeCategoriesCarousel;
