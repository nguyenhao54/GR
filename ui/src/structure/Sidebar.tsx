import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { NavLink } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { FaPaperPlane } from "react-icons/fa";

const getListItems = (role?: string) => {

  let listItems = [];
  listItems.push({
    title: "Hồ sơ",
    icon: <FaUser className="text-lg" />,
    route: "profile",
  });
  if (role === "student") {
    listItems.push({
      title: "Dashboard",
      icon: <MdHomeFilled className="text-lg scale-125 " />,
      route: "dashboard",
    })
  }
  listItems.push({
    title: role === "student" ? "Lịch học" : "Lịch dạy",
    icon: <FaCalendarAlt className="text-lg" />,
    route: "calendar",
  })

  listItems.push({
    title: role === "student" ? "Yêu cầu" : "Phê duyệt",
    icon: <FaPaperPlane className="text-lg" />,
    route: "calendar",
  })

  if (role === "admin") {
    listItems.push({
      title: "Quản lý",
      icon: <FaGear className="text-lg" />,
      route: "admin/manage-user",
    })
  }
  return listItems;
}

function Sidebar() {
  const user = useSelector((appState: AppState) => appState.user.user)

  return (
    <div className="font-bold text-xs w-58 fixed top-14 left-2 h-full">
      <div className="bg-white rounded-md w-72 mt-2 py-2 mr-2">
        {getListItems(user?.role).map((item, index) => {
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
    </div>
  );
}

export default Sidebar;
