"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTestimonialStore } from "../../store/testimonialStore";

const ReviewSection = () => {
  const { testimonials, fetchTestimonials, loading } = useTestimonialStore();
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Fetch testimonials on load
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials]);

  // If loading or empty
  if (loading || testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center p-20 bg-amber-800 text-white">
        Loading testimonials...
      </div>
    );
  }

  const active = testimonials[activeIndex];

  return (
    <div className="relative flex flex-col items-center justify-center p-10 md:p-16 w-full bg-gradient-to-br from-amber-800 via-amber-700 text-white overflow-hidden">
      {/* Logo */}
      <Link
        className="mb-8 md:mb-12 hover:opacity-80 transition"
        href="https://dadimaakeladdu.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="h-40" src="/images/logo.webp" alt="Dadimaa Ke Laddu Logo" />
      </Link>

      {/* Left Arrow */}
      <button
        onClick={() =>
          setActiveIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
          )
        }
        className="absolute left-6 md:left-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all z-10"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() =>
          setActiveIndex((prev) => (prev + 1) % testimonials.length)
        }
        className="absolute right-6 md:right-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Review Content */}
      <div className="flex flex-col items-center text-center max-w-4xl transition-all duration-700 ease-in-out z-10">
        <p className="md:text-2xl text-lg font-medium leading-relaxed mb-8">
          “{active.message}”
        </p>
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-amber-200 shadow-md object-cover"
            src={active.image}
            alt={active.name}
          />
          <div className="text-sm md:text-base">
            <p className="font-semibold text-lg">{active.name}</p>
            <p className="opacity-90">{active.title}</p>
          </div>
        </div>
      </div>

      {/* Floating Animated Image */}
      <motion.img
        initial={{ x: 150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        src="/images/laddu.png"
        alt="Laddu Box"
        className="absolute bottom-0 right-20 w-40 md:w-96 object-contain pointer-events-none"
      />
    </div>
  );
};

export default ReviewSection;
