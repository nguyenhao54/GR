import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { Menu, MenuItem } from "@mui/material";
import { FaCaretDown } from "react-icons/fa";
import { eraseCookie } from "../utils";

function Header() {
  const user = useSelector((appState: AppState) => appState.user.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='fixed h-14 bg-whit top-0 w-full bg-white flex items-center justify-between'>
      <div className='bg-white h-12 flex items-center justify-between'>
        <NavLink to='/' className='bg-white w-full '>
          <div className='w-32 p-30 px-8 text-3xl text-barnRed font-bold'>
            TENDIFY
          </div>
        </NavLink>
      </div>
      <div className='p-4 px-8 flex justify-center hover:cursor-pointer items-center'>
        <img
          className='w-10 h-10 border-4 shadow-md border-neutral-200 bg-barnRed rounded-full'
          src={user?.photo}
        ></img>
        <div className='flex flex-col p-4 text-neutral-800'>
          <p className='font-semibold'>{user?.name}</p>
          <p>{user?.codeNumber}</p>
        </div>
        <div className='hover:cursor-pointer pl-2 pb-2' onClick={handleClick}>
          <FaCaretDown />
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
        <MenuItem
          onClick={() => {
            navigate("/profile");
            setAnchorEl(null);
          }}
          style={{ margin: 4, borderRadius: 4, fontWeight: 600 }}
        >
          Hồ sơ
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
