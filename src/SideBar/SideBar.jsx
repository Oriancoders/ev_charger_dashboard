// src/components/Sidebar.jsx

import { useState } from "react";
import {
  FaTachometerAlt,
  FaBolt,
  FaClock,
  FaHistory,
  FaBell,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import { useGlobalContext } from "../GlobalStates/GlobalState";
import { useNavigate } from "react-router-dom";
import { RxDoubleArrowLeft } from "react-icons/rx";
import ApiService from "../ApiServices/ApiService";

const menuItems = {
  admin: [
    { label: "Main Dashboard", icon: <FaTachometerAlt /> },
    { label: "Control Supply", icon: <FaBolt /> },
    { label: "Start Session", icon: <FaPlus /> },
    { label: "Recent Session", icon: <FaClock /> },
    { label: "History", icon: <FaHistory /> },
  ],
  user: [
    { label: "Main Dashboard", icon: <FaTachometerAlt /> },
    { label: "Start Session", icon: <FaPlus /> },
    { label: "Recent Session", icon: <FaClock /> },
    { label: "History", icon: <FaHistory /> },
    { label: "Notifications", icon: <FaBell /> },
  ]
}

  ;

const Sidebar = () => {
  const { activeItem, setActiveItem, setIsAuthenticated, isAuthenticated, scrwidth, authData } = useGlobalContext()
  const navigate = useNavigate()
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)

  const logout = async () => {

    try {
      ApiService.logout()
      console.log("logout hogaya hau ")
      setIsAuthenticated(false)

      navigate("/")
    } catch {
      console.log("logout nh hua ")
    }

  }

  return (
    <div style={{ transform: isSideBarOpen ? 'translateX(0%)' : 'translateX(-100%)', }} className="md:w-64 h-screen   bg-[#F4F6F8] shadow-md flex flex-col justify-between md:relative absolute transition-all ease-in-out">

      {scrwidth < 765 && (
        <div onClick={() => setIsSideBarOpen(!isSideBarOpen)} className="absolute text-xl py-16 px-2 rounded-r-2xl bg-linear-to-r from-[#0A86F0] to-[#3870AB] text-white right-0 top-1/2 -translate-y-1/2 translate-x-full transition-all "><RxDoubleArrowLeft style={{ transform: isSideBarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} /></div>
      )}
      <div>

        <h1 className="text-3xl italic font-bold text-[#1E1E2F] px-6 py-4">Ev Charger</h1>

        {authData.role == "ADMIN" ? (
          <nav className="flex flex-col gap-2 px-4 mt-4">
            {menuItems.admin.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.label}
                onClick={() => setActiveItem(item.label)}
              />
            ))}
          </nav>
        ) : (
          <nav className="flex flex-col gap-2 px-4 mt-4">
            {menuItems.user.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.label}
                onClick={() => setActiveItem(item.label)}
              />
            ))}
          </nav>
        )}
      </div>

      <button onClick={() => logout()} className="m-4 justify-between flex items-center gap-2 bg-[#1E1E2F] text-white px-4 py-2 rounded-lg shadow hover:opacity-90 cursor-pointer text-sm">
        Logout <FaSignOutAlt />
      </button>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex  justify-between items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 shadow ${active
      ? "bg-gradient-to-b from-[#0A86F0] to-[#3870AB] text-white"
      : "text-[#1E1E2F] bg-white hover:bg-gray-200"
      }`}
  >
    <span className="font-medium sm:text-sm text-xs">{label}</span>
    <span className="text-sm">{icon}</span>
  </div>
);

export default Sidebar;
