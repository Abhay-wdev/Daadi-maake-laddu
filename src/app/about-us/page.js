"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Leaf,
  ShieldCheck,
  Users,
  Sparkles,
  Quote,
} from "lucide-react";
import ReviewSection from "../components/ReviewSection";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    show: {
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans">
      {/* HERO SECTION */}
      <motion.section
        className="relative text-white text-center py-20 px-6 shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        style={{
          backgroundImage: "url('/images/poster.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-[1px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.div>

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              About Us
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-100">
              Blending traditional wisdom with modern nutrition — bringing you healthy, handmade food crafted with love.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* HIGHLIGHT CARDS */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Heart,
              title: "Handmade with Love",
              text: "Crafted using traditional family recipes.",
            },
            {
              icon: Leaf,
              title: "100% Natural",
              text: "No chemicals, no artificial preservatives.",
            },
            {
              icon: ShieldCheck,
              title: "Nutrient Dense",
              text: "Rich in fibre, minerals, vitamins & antioxidants.",
            },
            {
              icon: Users,
              title: "For Every Generation",
              text: "Healthy choices for kids, adults & elders.",
            },
          ].map((item, i) => (
            <motion.div
              variants={fadeUp}
              key={i}
              className="p-6 bg-white shadow-md rounded-xl border hover:shadow-xl transition transform hover:-translate-y-1 text-center"
            >
              <item.icon className="w-12 h-12 mx-auto text-[#BB4D00] mb-3" />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm mt-2 text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ABOUT MAIN CONTENT WITH SLIDE UP */}
      <section className="py-12 px-6 md:px-20 max-w-6xl mx-auto leading-relaxed">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-6 text-lg"
        >
          We create products like{" "}
          <strong>Healthy Laddus, Panjeeri, Pregnancy Nutrition Mixes, Khajoor, Nuts, Seeds</strong>
          — made from carefully selected premium ingredients.
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-lg"
        >
          Our mission is to deliver food that is wholesome, pure, and beneficial for the immune system.
          Every bite nourishes with{" "}
          <strong>minerals, vitamins, antioxidants, fibre & natural energy</strong>.
        </motion.p>

        {/* Animated Section Title */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-[#BB4D00] mt-12 mb-8 flex items-center gap-2"
        >
          <Sparkles className="w-7 h-7" />
          Know Our Product Categories
        </motion.h2>

        {/* PRODUCT TIMELINE */}
        <div className="border-l-4 border-[#BB4D00] pl-6 space-y-14">
          {[
            {
              title: "Dadi Maa Ke Laddu",
              text:
                "Traditional recipes perfected over generations — including Panjiri, Gluten-Free Laddus and immunity blends.",
            },
            {
              title: "Women Power Nutrition",
              text:
                "Saunth, Ajwain, Gond, Sothora blends for postpartum recovery. Asthiposhak Panjiri strengthens bones and supports daily energy.",
            },
            {
              title: "Healthy Kids",
              text:
                "Multi Grain, Nutty Seeds & Dry Fruit Laddus — designed to boost strength, immunity & mental development.",
            },
            {
              title: "Senior-Friendly Nutrition",
              text:
                "Flaxseed, Khajoor & Nut Laddus that support digestion, joint strength & heart health naturally.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-[#BB4D00]">{item.title}</h3>
              <p className="text-lg mt-2">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
  <ReviewSection/>
      {/* ANIMATED COUNTERS */}
      <section className="bg-[#FFF2E8] py-16 text-center mt-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { number: "10K+", label: "Happy Customers" },
            { number: "40+", label: "Handmade Products" },
            { number: "18+", label: "Years of Trust" },
            { number: "100%", label: "Natural Ingredients" },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <p className="text-4xl md:text-5xl font-extrabold text-[#BB4D00]">
                {item.number}
              </p>
              <p className="text-gray-700 font-medium mt-2">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

    

 
    </div>
  );
}
