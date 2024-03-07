import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import men1 from "../../assets/men1.jpg";
import men2 from "../../assets/men2.jpg";
import female1 from "../../assets/female1.jpg";
import female2 from "../../assets/female2.jpg";
import aboutpic from "../../assets/aboutpic.jpg";
import "./About.css";
import Footer from "../../components/Footer/Footer";
function About() {
  return (
    <div>
      <Navbar />

      <div className="about-section1">
        <div className="about-details">
          <h1>About Us</h1>
          <div className="details">
            <div className="left">
              <h2>WE ARE FLAVORFUSE</h2>
              <p>
                Welcome to FlavorFuse, where culinary exploration meets
                personalized perfection! Our recipe recommendation system is the
                heart of our culinary hub, designed to elevate your cooking
                experience to new heights.We believe in the joy of discovery,
                and our recommendation system is the compass that guides you
                through an ever-expanding universe of flavors.
              </p>
            </div>
            <div className="right">
              <img src={aboutpic} alt="team poster" />
            </div>
          </div>
        </div>
      </div>
      <div className="about-section2">
        <h1>Our Team</h1>
        <div className="team">
          <div className="team-members">
            <div className="person">
              <img src={men1} alt="men-avatar" />
              <h2>Akhil S Anil</h2>
            </div>
            <div className="person">
              <img src={men2} alt="men-avatar" />
              <h2>Edrin Biju</h2>
            </div>
            <div className="person">
              <img src={female1} alt="female-avatar" />
              <h2>Swathi Dinesh</h2>
            </div>
            <div className="person">
              <img src={female2} alt="female-avatar" />
              <h2>Safa R H</h2>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
