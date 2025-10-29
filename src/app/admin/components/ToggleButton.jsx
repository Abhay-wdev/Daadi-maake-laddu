import React, { useState } from "react";
import { toggleCategoryStatus } from "../services/categoryService.js";
import toast from "react-hot-toast";

const ToggleCategoryButton = ({ id, isActive: initialActive }) => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(initialActive);

  const handleToggle = async () => {
    try {
      setLoading(true);
      const data = await toggleCategoryStatus(id);
      setActive(data.data.isActive);

      // toast / alert
      toast.success(`Category ${data.data.isActive ? "Activated" : "Deactivated"}!`);
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error("Error toggling category status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative w-16 h-8 flex items-center rounded-full transition-colors duration-300 
    ${active ? "bg-green-500" : "bg-red-500"} 
    ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Knob */}
      <span
        className={`absolute left-1 w-6 h-6  border-1 border-gray-900 bg-white rounded-full shadow-md transform transition-transform duration-300
      ${active ? "translate-x-8 text-green-500 " : "translate-x-0 text-red-500"}`}
      ></span>

      {/* Label (appears outside the switch for clarity) */}
      <span className={`ml-20 text-sm font-medium   ${active ? 'text-green-500' : 'text-red-500'}`}>
        {loading ? "Processing..." : active ? "Active" : "Inactive"}
      </span>
    </button>
  );
};

export default ToggleCategoryButton;
