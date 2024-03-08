import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { NavLink } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

const listItems = [
  {
    title: "Dashboard",
    icon: <MdHomeFilled className="text-lg scale-125 " />,
    route: "dashboard",
  },
  {
    title: "Lịch học",
    icon: <FaCalendarAlt className="text-lg" />,
    route: "calendar",
  },
  {
    title: "Quản lý",
    icon: <FaCalendarAlt className="text-lg" />,
    route: "admin/manage-user",
  }
];

function Sidebar() {
//   const [{ user, playlists }, dispatch] = useStateValue();

  return (
    <div className="font-bold text-xs w-58 fixed top-14 left-2 h-full">
      <div className="bg-white rounded-md w-72 mt-2 py-2 mr-2">
        {listItems.map((item, index) => {
          return (
            <NavLink
              to={item.route || ""}
              key={index}
              className={({ isActive }) =>
                isActive
                  ? `p-4 py-2 m-2 flex flex-horizontal hover:bg-gray-200 items-center${isActiveStyles}`
                  : `p-4 py-2 m-2 flex flex-horizontal hover:bg-gray-200 items-center ${isNotActiveStyles}`
              }
            >
              {item.icon}
              <p className="ml-4 mt-1 font-semibold text-md scale-105">
                {item.title}
              </p>
            </NavLink>
          );
        })}
      </div>
      {/* <hr className="border-t-1 border-neutral-700 mx-7 my-2"></hr>
      <div className="bg-[#1C1C1C] overflow-auto h-[50%]">
        <Link
          to="/download"
          className="text-textColor hover:text-white flex items-center gap-2
              duration-100 transition-all ease-in-out p-2 mx-5"
        >
          <BsArrowDownCircle className="text-xl" />
          <p>Install App</p>
        </Link>
      </div> */}
    </div>
  );
}

export default Sidebar;
