import React, { useState } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  Award,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";
import iconnn from "../assets/iconnn.png";
import ContestPopup from "./contestpopup";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Sidebar = () => {
  const { user } = useUser();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleContestClick = () => {
    navigate("/contest");
  };
  const handleWalletClick = () => {
    navigate('/mywallet');
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-60 bg-teal-900 flex flex-col">
        {/* Logo Section */}
        <div className="flex justify-between items-center p-4">
          <div className="bg-white rounded-lg p-2">
            <img
              src={user?.userImage || iconnn}
              alt="Logo"
              className="h-10 w-10 rounded-lg"
            />
          </div>
        </div>

        {/* Organization */}
        <div className="mt-4 mx-4 bg-teal-800 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
              {user?.orgName ? user.orgName.charAt(0).toUpperCase() : "O"}
            </div>
            <span className="ml-3 text-white text-[11px] font-medium">
              {user?.orgName || "Organization Name"}
            </span>
          </div>
        </div>

        {/* Create Contest Button */}
        <div className="mx-4 mt-6">
          <button
            onClick={handleCreateClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-4 flex items-center justify-center"
          >
            <span className="mr-2">+</span>
            Create Contest
          </button>
        </div>

        {/* Main Menu */}
        <div className="mt-10 text-left">
          <p className="text-xs text-teal-500 font-medium px-4 mb-2">
            MAIN MENU
          </p>
          <div className="flex flex-col">
            <a
              href="#"
              onClick={handleDashboardClick}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === "/dashboard"
                  ? "bg-teal-800"
                  : "hover:bg-teal-800"
              }`}
            >
              <LayoutDashboard size={20} className="mr-3" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              onClick={handleContestClick}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === "/contest" ||
                location.pathname === "/create-spotlight-contest" ||
                location.pathname === "/contest-details" ||
                location.pathname === "/edit-contest"
                  ? "bg-teal-800"
                  : "hover:bg-teal-800"
              }`}
            >
              <Award size={20} className="mr-3" />
              <span>Contest</span>
            </a>
            <a
              href="#"
              onClick={handleWalletClick}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === '/mywallet' ? 'bg-teal-800' : 'hover:bg-teal-800'
              }`}
            >
              <CreditCard size={20} className="mr-3" />
              <span>Wallet</span>
            </a>
          </div>
        </div>

        {/* Other Menu */}
        <div className="mt-auto text-left mb-4">
          <p className="text-xs text-teal-500 font-medium px-4 mb-2">OTHER</p>
          <div className="flex flex-col">
            <a
              href="#"
              onClick={() => navigate("/settings")}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === "/settings"
                  ? "bg-teal-800"
                  : "hover:bg-teal-800"
              }`}
            >
              <Settings size={20} className="mr-3" />
              <span>Settings</span>
            </a>
            <a
              href="/"
              className="flex items-center px-4 py-3 text-white hover:bg-teal-800"
            >
              <LogOut size={20} className="mr-3" />
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </div>
      <ContestPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
  );
};

export default Sidebar;
