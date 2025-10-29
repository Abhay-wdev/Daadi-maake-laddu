"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking
  const router = useRouter();

  // Only run role check on client
  useEffect(() => {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      setIsAdmin(false);
      router.replace("/"); // redirect
      return;
    }

    const user = JSON.parse(userJSON);
    const allowedRoles = ["admin", "seller", "manager"];
    if (!allowedRoles.includes(user.role)) {
      setIsAdmin(false);
      router.replace("/"); // redirect
    } else {
      setIsAdmin(true); // allow
    }
  }, [router]);

  // While checking role, render nothing or a loader
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // Block non-admin
  if (!isAdmin) return null;

  // Admin UI
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 overflow-y-auto hide-scrollbar">{children}</main>
      </div>
    </div>
  );
}
