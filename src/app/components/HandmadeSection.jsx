import Link from 'next/link';
import React from 'react';

const HandmadeSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Text Content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-4xl font-serif  text-amber-900 mb-6 leading-tight">
              Pure Handmade.<br></br> Blessed by indian Tradition.
            </h1>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From <span className="font-semibold text-amber-800">Dadi Maa’s kitchen</span> to your home — our laddus are crafted 
              with love, purity, and age-old recipes that nourish both body and soul.  
              Every bite carries the warmth of home and the care of generations.
            </p>

            <div className="space-y-5 mb-10">
              {/* Feature 1 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#fdf7e3] text-green-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="ml-4 text-lg text-gray-800">
                  🌿 <strong>100% Handmade</strong> — every laddu is shaped by hand, not by machines, preserving its authentic texture and taste.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#fdf7e3] text-green-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="ml-4 text-lg text-gray-800">
                  💛 <strong>Preservative-Free Goodness</strong> — made with pure ghee, jaggery, and dry fruits; no chemicals, no shortcuts.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#fdf7e3] text-green-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="ml-4 text-lg text-gray-800">
                  👩‍👧 <strong>Made by Local Women</strong> — empowering rural women through self-employment and skill development.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#fdf7e3] text-green-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="ml-4 text-lg text-gray-800">
                  🇮🇳 <strong>Rooted in Indian Tradition</strong> — inspired by recipes passed down from grandmothers’ kitchens, 
                  bringing authentic taste and health together.
                </p>
              </div>
            </div>
<Link href="/products">
            <button className="bg-[#BB4D00] text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg">
              Shop Now
            </button>
            </Link>
          </div>

          {/* Right Column - Image */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-red-200 rounded-2xl transform rotate-3 scale-105 opacity-70"></div>
              <img
                src="/images/ladduimage.webp"
                alt="Dadi Maa Ke Laddu Handmade with Love"
                className="relative rounded-2xl shadow-xl w-full max-w-md h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandmadeSection;
