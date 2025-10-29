"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function UserDropdown({ onClose }) {
  const router = useRouter();

  const handleProfileClick = () => {
    onClose();
    router.push("/profile");
  };

  return (
    <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden bg-white">
      <ul className="text-sm divide-y">
        <li
          className="flex items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-gray-100"
          onClick={handleProfileClick}
        >
          <span>My Profile</span>
        </li>
      </ul>
    </div>
  );
}
