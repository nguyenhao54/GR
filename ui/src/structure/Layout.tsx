import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import Header from "./Header";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Dialog } from "../common";
import { AppState } from "../redux/store";
import { useSelector } from "react-redux";

const Layout = () => {
  const navigate = useNavigate();
  const url = useLocation();
  const user = useSelector((appState: AppState) => appState.user.user)

  useEffect(() => {
    if (url.pathname === "/") {
      if (user?.role === "student") navigate("/dashboard");
      else navigate("/calendar")
    }
  }, [navigate, url.pathname, user?.role]);

  return (
    <div className="h-full font-montserrat text-xs">
      <div className="flex h-[100vh]">
        <Header></Header>
        <Sidebar />
        <div className="bg-neutral-100 h-full w-full">
          <div className="fixed left-[288px] top-14 ml-4 w-full h-full">
            <div className='flex mt-2 gap-2 w-[calc(100%-305px)] h-[calc(100vh-66px)] overflow-scroll'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Dialog></Dialog>
    </div>
  );
};

export default Layout;
