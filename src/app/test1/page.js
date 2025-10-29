"use client";
import React, { useEffect } from "react";
import { useSubCategoryStore } from "../../store/useSubCategoryStore"; // adjust path

const SubCategoryList = () => {
  const {
    subCategories,
    loading,
    error,
    fetchSubCategories,
  } = useSubCategoryStore();

  // Fetch data when component mounts
  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  // ✅ Log fetched subcategories whenever they change
  useEffect(() => {
    if (subCategories && subCategories.length > 0) {
      console.log("Fetched Subcategories:", subCategories);
    }
  }, [subCategories]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Subcategories List</h2>
      <ul className="space-y-2">
        {subCategories.length > 0 ? (
          subCategories.map((sub) => (
            <li
              key={sub._id}
              className="border p-3 rounded-md shadow-sm bg-white"
            >
              <p className="font-medium">{sub.name}</p>
              <p className="text-sm text-gray-500">{sub.description}</p>
              {/* ✅ Optional: show slug or id for debugging */}
              <p className="text-xs text-gray-400">ID: {sub._id}</p>
              <p className="text-xs text-gray-400">Slug: {sub.slug}</p>
            </li>
          ))
        ) : (
          <p>No subcategories found.</p>
        )}
      </ul>
    </div>
  );
};

export default SubCategoryList;
