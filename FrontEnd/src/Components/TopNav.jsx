import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard,
  Award,
  Plus,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import iconnn from '../assets/iconnn.png';
import ContestPopup from './contestpopup';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={15} /> },
  { key: 'contest', label: 'Contests', path: '/contest', icon: <Award size={15} /> },
  { key: 'wallet', label: 'Wallet', path: '/mywallet', icon: <CreditCard size={15} /> },
  { key: 'settings', label: 'Settings', path: '/settings', icon: <Settings size={15} /> },
];

const TopNav = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      {/* ── Top Nav Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center">
        {/* Pill container */}
        <div className="mx-auto w-full max-w-5xl bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm px-4 py-2.5 flex items-center gap-4">

          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100">
              <img
                src={user?.userImage || iconnn}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold text-gray-900 hidden sm:block">
              {user?.orgName || 'ZeeContest'}
            </span>
          </button>

          {/* Nav Items — center */}
          <nav className="flex items-center gap-1 mx-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Create button */}
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus size={13} />
              <span className="hidden sm:block">New</span>
            </button>

            {/* Avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-1.5 p-0.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {user?.userImage ? (
                    <img src={user.userImage} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content clears the fixed navbar */}
      <div className="h-[68px]" />

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around items-center px-2 h-16 shadow-lg">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-medium text-gray-400"
        >
          <Plus size={15} />
          New
        </button>
      </nav>

      <ContestPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
};

export default TopNav;
