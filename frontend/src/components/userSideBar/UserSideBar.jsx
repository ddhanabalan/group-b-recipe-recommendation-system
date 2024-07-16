import React from "react";
import { Link } from "react-router-dom";
import "../../styles/SideBar.css";
import { IoIosSave } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdOutlineFeedback } from "react-icons/md";

const UserSideBar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/user/savedrecipes">
            <IoIosSave style={{ fontSize: 20, paddingRight: 5 }} />
            Saved Recipes
          </Link>
        </li>
        <li>
          <Link to="/user/addedrecipes">
            <IoIosAddCircleOutline style={{ fontSize: 20, paddingRight: 5 }} />
            Added Recipes
          </Link>
        </li>
        <li>
          <Link to="/user/feedbacks">
            <MdOutlineFeedback style={{ fontSize: 20, paddingRight: 5 }} />
            Feedbacks
          </Link>
        </li>
        <li>
          <Link to="/user/profile">
            <CgProfile style={{ fontSize: 20, paddingRight: 5 }} />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSideBar;
