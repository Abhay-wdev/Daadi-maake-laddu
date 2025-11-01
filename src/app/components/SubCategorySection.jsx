"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const SubCategorySection = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/subcategories");
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data?.data || data?.subcategories || [];

        const active = list.filter((item) => item.isActive);
        setSubcategories(active);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={36} />
        <p className="text-gray-600 font-medium">
          Discovering amazing subcategories...
        </p>
      </div>
    );
  }

  if (!subcategories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-orange-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Subcategories Available
        </h3>
        <p className="text-gray-500 max-w-md text-center">
          Check back later as we're always adding new exciting categories for
          you to explore.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto md:px-8 py-12 md:py-16 text-center">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Explore Our{" "}
          <span className="text-amber-700 font-serif">Category</span>
        </h2>
        <p className="text-gray-600 font-serif max-w-2xl mx-auto">
          Discover our curated collection of products organized by category to
          help you find exactly what you're looking for.
        </p>
      </div>

      {/* Category Cards using FLEX */}
      <div className="flex flex-wrap justify-center items-center gap-10 md:gap-25">
        {subcategories.map((sub, index) => (
          <Link
            key={sub._id}
            href={`/products?subCategory=${sub.slug}`}
            className="group flex flex-col items-center text-center w-80  transition-all duration-300 hover:scale-105"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Image */}
            <div className="relative  w-70 h-70 mb-4 flex items-center justify-center">
              <Image
                src={sub.image}
                alt={sub.name}
                fill
                className="object-contain border transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-md"
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 uppercase group-hover:text-amber-800 transition-colors duration-300">
              {sub.name}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-12 text-center">
        <Link
          href="/products"
          className="inline-flex items-center text-amber-700 font-medium hover:text-orange-600 transition-colors"
        >
          View all categories
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default SubCategorySection;
