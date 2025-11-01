// WhyChooseUs.js
import React from "react";

const features = [
  {
    icon: "/images/homemad.webp", // Replace with your image path
    title: "Handmade & Homemade",
    description:
      "Our process is simple. Our Laddus are completely Homemade & Handmade with proper hygiene.",
  },
  {
    icon: "/images/healthy.webp", // Replace with your image path
    title: "Healthy & Nutritious",
    description:
      "Our Laddus contain all natural ingredients making them a healthy alternative.",
  },
  {
    icon: "/images/chemicalless.webp", // Replace with your image path
    title: "Preservatives Free",
    description:
      "Our Laddus does not contain any form of preservatives, additives or artificial colours.",
  },
  {
    icon: "/images/sugarfree.webp", // Replace with your image path
    title: "Refined Sugar Free",
    description:
      "All Laddus by Equisential are Refined Sugar Free. We prepare our Laddus either in Dates or Jaggery",
  },
];

const WhyChooseUs = () => {
  return (
    <div className=" py-12 px-5 text-center">
      <h2 className="text-amber-900 font-bold text-2xl md:text-3xl mb-2">
        Why Choose Us?
      </h2>
      
      {/* Decorative divider */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <div className="w-24 h-0.5 bg-amber-900"></div>
        <div className="w-2.5 h-2.5 bg-amber-900 rotate-45"></div>
        <div className="w-24 h-0.5 bg-amber-900"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map(({ icon, title, description }, index) => (
          <div key={index} className="p-5">
            {/* Icon with color filter to match original SVG color */}
            <div className="mb-4 flex justify-center">
              <img 
                src={icon} 
                alt={title} 
                className="w-50 h-50 bg-[#FFF3E0] p-4 rounded-full"
              />
            </div>
            <h3 className="text-amber-900 font-semibold text-lg md:text-xl mb-2">
              {title}
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;