<<<<<<< HEAD
import React, { useState } from 'react';
<<<<<<< HEAD
import { ChevronRight, LayoutDashboard, Award, Settings, LogOut } from 'lucide-react';
import iconnn from '../assets/iconnn.png';
import ContestPopup from './contestpopup';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
=======
import {
  LayoutDashboard,
  Award,
  Settings,
  LogOut,
  CreditCard,
  Plus,
} from 'lucide-react';
import iconnn from '../assets/iconnn.png';
import ContestPopup from './contestpopup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const navItems = [
  {
    key: 'dashboard',
    icon: <LayoutDashboard size={22} />,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: 'contest',
    icon: <Award size={22} />,
    label: 'Contest',
    path: '/contest',
  },
  { key: 'plus', icon: <Plus size={22} />, label: 'Create', action: 'popup' },
  {
    key: 'wallet',
    icon: <CreditCard size={22} />,
    label: 'Wallet',
    path: '/mywallet',
  },
  {
    key: 'settings',
    icon: <Settings size={22} />,
    label: 'Settings',
    path: '/settings',
  },
];

const Sidebar = () => {
  const { user } = useUser();
>>>>>>> oscar-branch
=======
import React, { useState } from "react";
import {
  LayoutDashboard,
  Award,
  Settings,
  LogOut,
  CreditCard,
  Plus,
} from "lucide-react";
import iconnn from "../assets/iconnn.png";
import ContestPopup from "./contestpopup";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const navItems = [
  {
    key: "dashboard",
    icon: <LayoutDashboard size={22} />,
    label: "Dashboard",
    path: "/dashboard",
  },
  { key: "contest", icon: <Award size={22} />, label: "Contest", path: "/contest" },
  { key: "plus", icon: <Plus size={22} />, label: "Create", action: "popup" },
  { key: "wallet", icon: <CreditCard size={22} />, label: "Wallet", path: "/mywallet" },
  { key: "settings", icon: <Settings size={22} />, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const { user } = useUser();
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
<<<<<<< HEAD
  const handleCreateClick = () => {
    setIsPopupOpen(true);
=======
  const handleNavClick = (item) => {
    if (item.action === "popup") {
      setIsPopupOpen(true);
    } else if (item.path) {
      navigate(item.path);
    }
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
  };

  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <div>
      {/* className="lg:ml-[10rem]" */}
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex fixed top-0 left-0 h-screen w-60 bg-teal-900 flex-col z-40">
        {/* Logo Section */}
        <div className="flex justify-between items-center p-4">
<<<<<<< HEAD
          <div className="bg-white p-2 rounded-lg">
            <img src={iconnn} alt="Logo" className="h-10 w-10" />
=======
  const handleNavClick = (item) => {
    if (item.action === 'popup') {
      setIsPopupOpen(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <div>
      {/* className="lg:ml-[10rem]" */}
      {/* Desktop Sidebar */}
      <div className='hidden sm:flex fixed top-0 left-0 h-screen w-60 bg-teal-900 flex-col z-40'>
        {/* Logo Section */}
        <div className='flex justify-between items-center p-4'>
          <div className='bg-white rounded-lg p-2'>
            <img
              src={user?.userImage || iconnn}
              alt='Logo'
              className='h-10 w-10 rounded-lg'
            />
>>>>>>> oscar-branch
=======
          <div className="bg-white rounded-lg p-2">
            <img
              src={user?.userImage || iconnn}
              alt="Logo"
              className="h-10 w-10 rounded-lg"
            />
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          </div>
        </div>

        {/* Organization */}
<<<<<<< HEAD
        <div className="mt-4 mx-4 bg-teal-800 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
              {user?.orgName ? user.orgName.charAt(0).toUpperCase() : "O"}
            </div>
<<<<<<< HEAD
            <span className="ml-3 text-white text-[11px] font-medium">Organization Name</span>
=======
        <div className='mt-4 mx-4 bg-teal-800 rounded-lg p-2 flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold'>
              {user?.orgName ? user.orgName.charAt(0).toUpperCase() : 'O'}
            </div>
            <span className='ml-3 text-white text-[11px] font-medium'>
              {user?.orgName || 'Organization Name'}
            </span>
>>>>>>> oscar-branch
=======
            <span className="ml-3 text-white text-[11px] font-medium">
              {user?.orgName || "Organization Name"}
            </span>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          </div>
        </div>

        {/* Create Contest Button */}
<<<<<<< HEAD
        <div className="mx-4 mt-6">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-4 flex items-center justify-center"
          >
            <span className="mr-2">+</span>
=======
        <div className='mx-4 mt-6'>
          <button
            onClick={() => setIsPopupOpen(true)}
            className='w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-4 flex items-center justify-center'
          >
            <span className='mr-2'>+</span>
>>>>>>> oscar-branch
            Create Contest
          </button>
        </div>

        {/* Main Menu */}
<<<<<<< HEAD
        <div className="mt-10 text-left">
          <p className="text-xs text-teal-500 font-medium px-4 mb-2">
            MAIN MENU
          </p>
          <div className="flex flex-col">
            <a
              href="#"
              onClick={() => navigate("/dashboard")}
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
              onClick={() => navigate("/contest")}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === "/contest"
                  ? "bg-teal-800"
                  : "hover:bg-teal-800"
              }`}
            >
              <Award size={20} className="mr-3" />
              <span>Contest</span>
            </a>
<<<<<<< HEAD
=======
        <div className='mt-10 text-left'>
          <p className='text-xs text-teal-500 font-medium px-4 mb-2'>
            MAIN MENU
          </p>
          <div className='flex flex-col'>
            <a
              href='#'
              onClick={() => navigate('/dashboard')}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === '/dashboard'
                  ? 'bg-teal-800'
                  : 'hover:bg-teal-800'
              }`}
            >
              <LayoutDashboard size={20} className='mr-3' />
              <span>Dashboard</span>
            </a>
            <a
              href='#'
              onClick={() => navigate('/contest')}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === '/contest'
                  ? 'bg-teal-800'
                  : 'hover:bg-teal-800'
              }`}
            >
              <Award size={20} className='mr-3' />
              <span>Contest</span>
            </a>
            <a
              href='#'
              onClick={() => navigate('/mywallet')}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === '/mywallet'
                  ? 'bg-teal-800'
                  : 'hover:bg-teal-800'
              }`}
            >
              <CreditCard size={20} className='mr-3' />
              <span>Wallet</span>
            </a>
>>>>>>> oscar-branch
=======
            <a
              href="#"
              onClick={() => navigate("/mywallet")}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === '/mywallet' ? 'bg-teal-800' : 'hover:bg-teal-800'
              }`}
            >
              <CreditCard size={20} className="mr-3" />
              <span>Wallet</span>
            </a>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
          </div>
        </div>

        {/* Other Menu */}
<<<<<<< HEAD
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
=======
        <div className='mt-auto text-left mb-4'>
          <p className='text-xs text-teal-500 font-medium px-4 mb-2'>OTHER</p>
          <div className='flex flex-col'>
            <a
              href='#'
              onClick={() => navigate('/settings')}
              className={`flex items-center px-4 py-3 text-white cursor-pointer ${
                location.pathname === '/settings'
                  ? 'bg-teal-800'
                  : 'hover:bg-teal-800'
              }`}
            >
              <Settings size={20} className='mr-3' />
              <span>Settings</span>
            </a>
            <a
              href='/'
              className='flex items-center px-4 py-3 text-white hover:bg-teal-800'
            >
              <LogOut size={20} className='mr-3' />
>>>>>>> oscar-branch
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
      <ContestPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
=======

      {/* Mobile Bottom Navigation */}
      <nav
        className='sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-between items-center px-1 h-20 shadow-lg'
        style={{ minHeight: 72, maxHeight: 80 }}
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item)}
            className={`
            flex flex-col items-center py-1 px-0 text-xs font-medium focus:outline-none 
            ${item.key === 'plus' ? 'plus-button-container' : 'flex-1 min-w-0'}
            ${
              (item.path && location.pathname === item.path) ||
              (item.key === 'plus' && isPopupOpen)
                ? 'text-orange-500'
                : 'text-gray-500 hover:text-orange-500'
            }
          `}
            aria-label={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Contest Popup */}
      <ContestPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
>>>>>>> oscar-branch
=======

      {/* Mobile Bottom Navigation */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-between items-center px-1 h-20 shadow-lg"
        style={{ minHeight: 72, maxHeight: 80 }} // Ensures enough height for all icons
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item)}
            className={`flex flex-col items-center flex-1 py-1 px-0 text-xs font-medium focus:outline-none ${
              (item.path && location.pathname === item.path) ||
              (item.key === "plus" && isPopupOpen)
                ? "text-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
            style={
              item.key === "plus"
                ? {
                    marginTop: -20,
                    background: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : { minWidth: 0, flex: 1 }
            }
            aria-label={item.label}
          >
            {item.icon}
            
          </button>
        ))}
      </nav>

      {/* Contest Popup */}
      <ContestPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
  );
};

export default Sidebar;