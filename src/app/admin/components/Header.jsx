"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import { usePathname } from "next/navigation"; 
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import ProfileIcon from "@/app/components/ProfileIcon";

export default function Header({ setSidebarOpen }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const bellRef = useRef();
  const userRef = useRef();

  const getTitle = (path) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/services": return "Services";
      case "/category": return "Category";
      case "/template": return "Template";
      case "/profile": return "My Profile";
      case "/request": return "Requests";
      case "/combo": return "Combo";
      case "/users": return "Users";
      default: return "Admin Panel";
    }
  };

  const title = getTitle(pathname);

  const handleClickOutside = (e) => {
    if (
      bellRef.current && !bellRef.current.contains(e.target) &&
      userRef.current && !userRef.current.contains(e.target)
    ) {
      setShowNotifications(false);
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
    setShowNotifications(false);
  };

  return (
    <header className="   t-0 h-20 z-50 px-4 flex items-center justify-between backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      {/* Left Side: Menu Icon + Title */}
      <div className="flex items-center gap-4">
        <FaBars
          className="text-xl cursor-pointer md:hidden hover:text-primary transition"
          onClick={() => setSidebarOpen(true)}
        />
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Right Side: Notification + User */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-200 transition relative"
          >
            <FaBell className="text-xl text-gray-800" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
        </div>

        {/* User Avatar */}
        <div className="relative"  >
           <ProfileIcon/>
          
        </div>
      </div>
    </header>
  );
}
