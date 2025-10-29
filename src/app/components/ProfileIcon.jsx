"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Remove token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setIsOpen(false);       // Close dropdown
    router.push("/login");  // Redirect to login page
  };

  return (
    <div className="relative">
      {/* Profile Image / Icon */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-indigo-400 transition-all"
      >
        <Image
          src="/images/user-avatar.png"
          alt="Profile"
          width={40}
          height={40}
          className="object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg">
          <Link
            href="/profile"
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
