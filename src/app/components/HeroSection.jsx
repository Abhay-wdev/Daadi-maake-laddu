"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dadimaabackend-2.onrender.com/api";
const HERO_IMAGES_ENDPOINT = `${API_BASE_URL}/hero`;

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to fetch hero images from API
  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(HERO_IMAGES_ENDPOINT);
      const fetchedData = response.data;

      // ✅ Save data with timestamp
      localStorage.setItem(
        "heroImages",
        JSON.stringify({ data: fetchedData, savedAt: Date.now() })
      );

      setHeroImages(fetchedData);
      setError("");
    } catch (err) {
      setError("Failed to fetch hero images");
      console.error("Error fetching hero images:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage or API
  useEffect(() => {
    const cached = localStorage.getItem("heroImages");
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in ms

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.savedAt > oneDay;

      if (!isExpired && parsed.data?.length > 0) {
        // ✅ Use cached data
        setHeroImages(parsed.data);
        setLoading(false);
        return;
      } else {
        // ❌ Expired or invalid — remove
        localStorage.removeItem("heroImages");
      }
    }

    // ✅ Fetch fresh data
    fetchHeroImages();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  const goToSlide = (index) => setCurrentIndex(index);

  const goToPrev = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );

  const goToNext = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );

  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB4D00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-96 bg-red-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (heroImages.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No hero images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {/* Desktop Images */}
      <div className="hidden md:block">
        {heroImages.map((image, index) => (
          <div
            key={`desktop-${image._id}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <a
              href={image.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={image.desktopImageUrl}
                alt={`Hero slide ${index}`}
                className="w-full h-full object-cover"
              />
               
               
            </a>
          </div>
        ))}
      </div>

      {/* Mobile Images */}
      <div className="md:hidden">
        {heroImages.map((image, index) => (
          <div
            key={`mobile-${image._id}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <a
              href={image.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={image.mobileImageUrl || image.desktopImageUrl}
                alt={`Hero slide ${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
               
            </a>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#BB4D00]/70 hover:bg-[#BB4D00]/90 text-white p-2 rounded-full transition-all shadow-md"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#BB4D00]/70 hover:bg-[#BB4D00]/90 text-white p-2 rounded-full transition-all shadow-md"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-[#BB4D00]" : "bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
