"use client";

import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { LuComponent } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

export default function Sidebar({ open, collapsed, setCollapsed, setSidebarOpen, onSelect, activeLabel }) {
  const navItems = [
    { label: "Profile", icon: <CgProfile /> },
    { label: "Address", icon: <LuComponent /> },
    { label: "Cart", icon: <LuComponent /> },
    // Add more items here
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${collapsed ? "w-[72px]" : "w-[260px]"}
        shadow-2xl overflow-y-auto bg-white`}
    >
      {/* Mobile close button */}
      <div className="flex justify-end p-3 md:hidden">
        <FaTimes
          className="cursor-pointer text-xl hover:text-red-400 transition"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Logo */}
      {(open || (typeof window !== "undefined" && window.innerWidth >= 768)) && (
        <div className="flex items-center h-19 mb-4 px-3">
          <div
            className={`relative overflow-hidden border p-2 rounded ${
              collapsed ? "h-10 w-20" : "h-10 w-40"
            }`}
          >
            <img src="/logo.webp" alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div className="hidden md:flex justify-end mt-5 px-3 pb-3">
        <FaChevronLeft
          onClick={() => setCollapsed(!collapsed)}
          className={`cursor-pointer transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </div>

      {/* Navigation */}
      <ul className="space-y-3 px-2">
        {navItems.map((item) => {
          const isActive = activeLabel === item.label;
          return (
            <li key={item.label}>
              <button
                onClick={() => {
                  onSelect(item.label);
                  setSidebarOpen(false);
                }}
                className={`group w-full flex items-center gap-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? "font-semibold text-blue-600" : "hover:opacity-80"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center min-w-10 h-10 rounded-xl text-xl transition-transform duration-300 group-hover:scale-110 ${
                    collapsed ? "mx-auto" : ""
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                {!collapsed && (
                  <span className="text-sm font-medium tracking-wide">{item.label}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
