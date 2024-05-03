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
          <IoIosSave style={{ fontSize: 20, paddingRight: 5 }} />
          <Link to="/user/savedrecipes">Saved Recipes</Link>
        </li>
        <li>
          <IoIosAddCircleOutline style={{ fontSize: 20, paddingRight: 5 }} />
          <Link to="/user/addedrecipes">Added Recipes</Link>
        </li>

        <li>
          <MdOutlineFeedback style={{ fontSize: 20, paddingRight: 5 }} />
          <Link to="/user/feedbacks">Feedbacks</Link>
        </li>
        <li>
          <CgProfile style={{ fontSize: 20, paddingRight: 5 }} />
          <Link to="/user/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
};
export default UserSideBar;
