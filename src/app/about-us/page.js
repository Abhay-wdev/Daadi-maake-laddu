"use client";
import React from "react";

export default function About() {
  return (
    <div className="bg-[#fff] text-gray-800 min-h-screen">
      {/* Header Section */}
      <section className="bg-[#BB4D00] text-white py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">About Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Bringing you handmade, healthy, and wholesome delights crafted with love and tradition.
        </p>
      </section>

      {/* About Content */}
      <section className="py-12 px-6 md:px-20 max-w-6xl mx-auto leading-relaxed">
        <p className="mb-6 text-lg">
          Our handmade product ranges from <strong>Healthy Laddus, Panjeeri, Pre & Post Pregnancy
          Complete Dietary Care, Khajoor, Nuts and Seeds</strong> etc., aiming to provide a healthy &
          balanced diet to every generation.
        </p>

        <p className="mb-6 text-lg">
          Our products are a rich source of <strong>anti-oxidants, fibre, protein</strong>, and a
          storehouse of <strong>minerals and vitamins</strong>. We choose premium quality ingredients
          in precise and perfect quantities to make your healthy choices easier.
        </p>

        <h2 className="text-3xl font-semibold text-[#BB4D00] mt-10 mb-4">
          Know About Our Products
        </h2>

        <h3 className="text-2xl font-semibold text-[#BB4D00] mt-6 mb-2">
          Dadi Maa Ke Laddu
        </h3>
        <p className="mb-4 text-lg">
          An online place for all generations that aims to be fit. Our Laddus come in a variety of
          forms including <strong>Panjiri</strong> and <strong>Gluten-Free</strong> options catering
          to all ages.
        </p>

        <h3 className="text-2xl font-semibold text-[#BB4D00] mt-6 mb-2">
          Women Power
        </h3>
        <p className="mb-4 text-lg">
          <strong>Saunth (Dry Ginger), Ajwain (Carom Seeds), Sothoura, Gond Laddu</strong>, etc., have
          excellent effects when taken in proper quantity after delivery. Our full postpartum dietary
          package also helps meet vitamin and nutrient requirements post-birth for both mother and
          child. Our <strong>Asthiposhak Panjiri</strong> is specially formulated for women to cope
          with daily challenges.
        </p>

        <h3 className="text-2xl font-semibold text-[#BB4D00] mt-6 mb-2">Children</h3>
        <p className="mb-4 text-lg">
          Our <strong>Multi Grain Laddu, Nutty Seeds Laddu, Dry Fruit Laddu</strong>, etc., help
          children and teenagers grow both physically and mentally strong while boosting their
          immunity.
        </p>

        <h3 className="text-2xl font-semibold text-[#BB4D00] mt-6 mb-2">Old People</h3>
        <p className="text-lg">
          <strong>Flax Seeds Laddu</strong> and <strong>Khajoor & Nuts Laddu</strong> are great
          sources of nutrition that strengthen bones and help recover from joint pain due to old age.
          They aid digestion, detoxify the body, and reduce the risk of heart disease.
        </p>
      </section>

    
    </div>
  );
}
