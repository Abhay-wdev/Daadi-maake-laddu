"use client";
import React, { useEffect } from "react";
import { useCategoryStore } from "../../store/CategoryStore.js";

const CategoryList = () => {
  const { categories, fetchCategories, loading, error } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2>All Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
