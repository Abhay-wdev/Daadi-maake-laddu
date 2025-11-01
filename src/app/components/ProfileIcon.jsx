"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const { user, getUserById, logout } = useAuthStore();

  // ✅ Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?._id) getUserById(parsedUser._id);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, [getUserById]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Auto-close after 1s if mouse leaves dropdown
  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout(router);
    setIsOpen(false);
  };

  // ✅ Generate initials if no image
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div ref={dropdownRef} className="relative" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:ring-2 hover:ring-indigo-400 transition-all overflow-hidden bg-white"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt="Profile"
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm">
            {getInitials(user?.name)}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50"
        >
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
