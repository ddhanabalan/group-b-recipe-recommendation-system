import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Herosection from "../../components/Herosection/Herosection";
import Popularrecipes from "../../components/Popularrecipes/Popularrecipes";
import Topcategories from "../../components/Topcategories/Topcategories";
//import Newrecipes from "../../components/Newrecipes/Newrecipes";
//import Whychooseus from "../../components/Whychooseus/Whychooseus";
//import Joinnow from "../../components/Joinnow/Joinnow";
//import Customersays from "../../components/Customersays/Customersays";
//import Footer from "../../components/Footer/Footer";
function Home() {
  return (
    <div>
      <Navbar />
      <Herosection />
      <Popularrecipes />
      <Topcategories />
      {/*<Newrecipes />
      <Whychooseus />
      <Joinnow />
      <Customersays />
  <Footer />*/}
    </div>
  );
}

export default Home;
