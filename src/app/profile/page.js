"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProfilePage from "../components/ProfilePage";
import ServicesPage from "../components/ServicesPage"; // Create this component
import ShippingAddressManager from "../components/Address";
import Cart from "../components/Cart";


export default function UserfilePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfilePage />;
         case "Address":
        return <ShippingAddressManager/>;
      case "Cart":
        return  <Cart/>;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setSidebarOpen={setSidebarOpen}
        onSelect={setActiveTab}
        activeLabel={activeTab}
      />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <main className="flex-1 p-4 overflow-y-auto hide-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
