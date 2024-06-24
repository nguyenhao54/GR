import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { Menu, MenuItem } from "@mui/material";
import { FaCaretDown } from "react-icons/fa";
import { eraseCookie } from "../utils";
import { FaBars, FaChessPawn } from "react-icons/fa6";
import { getListItems } from './Sidebar';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';

function Header() {
  const user = useSelector((appState: AppState) => appState.user.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const carretRef = React.createRef<HTMLDivElement>()
  const handleClick = (_event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(carretRef.current);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='fixed h-14 bg-whit top-0 w-full bg-white flex items-center justify-between'>
      <div className='bg-white h-12 flex items-center justify-between'>
        <NavLink to='/' className='bg-white w-full '>
          <div className='w-32 p-30 sm:px-8 px-4 text-3xl text-neutral-800 flex font-bold'>
            <p className="hidden sm:block">TEND</p><span><FaChessPawn color="#C1121F" /></span><p className="hidden sm:block">FY </p>
          </div>
        </NavLink>
      </div>
      <div className='pt-3 px-4 sm:p-4 sm:px-8 flex justify-center hover:cursor-pointer items-center' onClick={handleClick}>
        <div className="sm:flex hidden">
          {user?.photo ? <img
            alt="user-photo"
            className='w-10 h-10 border-4 shadow-md border-neutral-200 rounded-full'
            src={user?.photo}
          ></img>
            : <div className="w-10 h-10 border-4 shadow-md border-neutral-200 bg-neutral-100 rounded-full">
              <span className="font-semibold text-neutral-600 text-xl flex justify-center items-center">{user?.name!.slice(0, 1).toUpperCase()}</span>
            </div>
          }
          <div className='flex flex-col px-2 pt-1 text-neutral-800'>
            <p className='font-semibold'>{user?.name}</p>
            <p>{user?.codeNumber}</p>
          </div>
        </div>
        <div className='hover:cursor-pointer pl-2 pb-2' ref={carretRef}>
          <FaCaretDown className="hidden sm:block" />
          <FaBars className="block sm:hidden text-xl" />
        </div>
      </div>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ ".MuiList-root": { padding: 0 } }}
      >
        <div className="block sm:hidden border-b-neutral-200 border-b font-nunitoSans">{getListItems(user?.role).map((item, index) => {
          return (
            <NavLink
              to={item.route || ""}
              key={index}
              className={({ isActive }) =>
                isActive
                  ? `p-2 sm:p-4 py-1 sm:py-2 m-2 flex flex-horizontal hover:bg-gray-200 items-center ${isActiveStyles}`
                  : `p-2 sm:p-4 py-1 sm:py-2 m-2 flex flex-horizontal hover:bg-gray-200 items-center ${isNotActiveStyles}`
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
        <div className="hidden sm:block">
          <MenuItem
            onClick={() => {
              navigate("/profile");
              setAnchorEl(null);
            }}
            style={{ margin: 4, borderRadius: 4, fontWeight: 600 }}
          >
            Hồ sơ
          </MenuItem>
        </div>
        <MenuItem
          onClick={() => {
            navigate("/profile/changePassword");
            setAnchorEl(null);
          }}
          style={{ margin: 4, borderRadius: 4, fontWeight: 600 }}
        >
          Đổi mật khẩu
        </MenuItem>
        <MenuItem
          onClick={() => {
            eraseCookie("token");
            navigate("login");
          }}
          style={{
            margin: 4,
            borderRadius: 4,
            backgroundColor: "#780000",
            color: "white",
            fontWeight: "600",
          }}
        >
          Đăng xuất
        </MenuItem>
        {/* <MenuItem onClick={handleClose} style={{margin: 4, borderRadius:4}}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
}

export default Header;
