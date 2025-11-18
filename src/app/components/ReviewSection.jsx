"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
const testimonials = [
  {
    name: "Aarohi Mehta",
    title: "Homemaker from Delhi",
    text: "Dadimaa Ke Laddu reminded me of my childhood! The aroma of ghee and cardamom brought tears of nostalgia. Pure, authentic, and made with love.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rohan Sharma",
    title: "Software Engineer @ Bangalore",
    text: "The taste of tradition, packed beautifully and delivered fresh. These laddus are not sweets — they are emotions wrapped in ghee!",
    image:
      "https://images.unsplash.com/photo-1600181953844-b522da18d6c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sneha Patel",
    title: "Teacher from Ahmedabad",
    text: "Super soft, perfectly sweet, and so nostalgic! My whole family loved them. Finally, laddus that truly feel homemade!",
    image:
      "https://images.unsplash.com/photo-1614281974922-eedcfaebebda?auto=format&fit=crop&w=600&q=80",
  },
];

const ReviewSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  const active = testimonials[activeIndex];

  return (
    <div className="relative flex flex-col items-center justify-center p-10 md:p-16 w-full bg-gradient-to-br from-amber-800 via-amber-700   text-white overflow-hidden">
      {/* Logo */}
      <Link
        className="mb-8 md:mb-12 hover:opacity-80 transition"
        href="https://dadimaakeladdu.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="h-40 "
          src="/images/logo.webp"
          alt="Dadimaa Ke Laddu Logo"
        />
      </Link>

      {/* Left Arrow */}
      <button
        onClick={goPrev}
        className="absolute left-6 md:left-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all z-10"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goNext}
        className="absolute right-6 md:right-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Review Content */}
      <div className="flex flex-col items-center text-center max-w-4xl transition-all duration-700 ease-in-out z-10">
        <p className="md:text-2xl text-lg font-medium leading-relaxed mb-8">
          “{active.text}”
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

 
       

      {/* Floating Animated Image (bottom-right) */}
      <motion.img
        initial={{ x: 150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        src="/images/laddu.png"
        alt="Laddu Box"
        className="absolute bottom-0 right-20   w-40 md:w-96 object-contain pointer-events-none"
      />
    </div>
  );
};

export default ReviewSection;
