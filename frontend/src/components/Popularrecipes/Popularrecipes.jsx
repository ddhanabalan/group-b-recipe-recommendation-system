import React from "react";
import Slider from "react-slick";
import Item from "../Items/Items";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Popularrecipes.css";
const Popularrecipes = () => {
  //dummy data
  const recipeData = [
    {
      id: 1,
      calorie: 728,
      imageurl:
        "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
      category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

      ratings: 4.7,
      reviews: 23,
      title: "Chef John's Carrot Cake",
      total_mins: 95,
    },
    {
      id: 2,
      calorie: 728,
      imageurl:
        "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
      category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

      ratings: 4.7,
      reviews: 23,
      title: "Chef John's Carrot Cake",
      total_mins: 95,
    },
    {
      id: 3,
      calorie: 728,
      imageurl:
        "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
      category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

      ratings: 4.7,
      reviews: 23,
      title: "Chef John's Carrot Cake",
      total_mins: 95,
    },
    {
      id: 4,
      calorie: 728,
      imageurl:
        "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
      category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

      ratings: 4.7,
      reviews: 23,
      title: "Chef John's Carrot Cake",
      total_mins: 95,
    },
    {
      id: 5,
      calorie: 728,
      imageurl:
        "https://images.media-allrecipes.com/userphotos/560x315/5262195.jpg",
      category: ["Desserts", "Fruit Desserts", "Pineapple Desserts"],

      ratings: 4.7,
      reviews: 23,
      title: "Chef John's Carrot Cake",
      total_mins: 95,
    },
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusonSelect: true,
  };
  return (
    <div className="popular">
      <h1>Popular Recipes</h1>
      <div className="popular-slider">
        <Slider {...settings}>
          {recipeData.map((item, i) => {
            return (
              <Item
                key={i}
                id={item.id}
                title={item.title}
                imageurl={item.imageurl}
                total_mins={item.total_mins}
                calorie={item.calorie}
                ratings={item.ratings}
              />
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Popularrecipes;
