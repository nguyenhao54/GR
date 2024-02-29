import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import Header from "./Header";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const url = useLocation();

  useEffect(() => {
    if (url.pathname === "/") navigate("/dashboard");
  }, [navigate, url.pathname]);

  return (
    <div className="h-full font-montserrat text-xs">
      <div className="flex h-[100vh]">
        <Header></Header>
        <Sidebar />
        <div className="bg-neutral-100 w-full h-full min-w-[400px]">
          <div className="fixed left-[288px] top-14 bottom-2 right-4">
            <div className='flex m-2 ml-4 gap-2 h-full w-full overflow-scroll'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
