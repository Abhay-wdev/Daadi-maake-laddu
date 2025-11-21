"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Connects to your backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Thank you for contacting us! We’ll get back to you soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.message || "❌ Failed to send message.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
     <motion.section
  className="relative text-white text-center py-20 px-6 shadow-md overflow-hidden"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.2 }}
  viewport={{ once: true }}
  style={{
    backgroundImage: "url('/images/about-poster.png')",
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
        Contact Us
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-100">
        We're here to help! Reach out to us for inquiries, support, or collaboration — our team will get back to you shortly.
      </p>
    </div>
  </motion.div>
</motion.section>


      {/* Contact Info + Form */}
      <section className="px-6 md:px-16 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-semibold text-[#BB4D00] mb-3">
            Get in Touch
          </h2>
          <p className="text-lg leading-relaxed">
            Reach out to us for any queries, feedback, or custom orders. Our
            team will get back to you as soon as possible.
          </p>

          <div className="space-y-3 mt-4">
            <p>
              📍 <strong>Address:</strong> M-251
Opp Vishwanath 
Parag road 
Ashiyana lucknow- 226012
            </p>
            <p>
              📞 <strong>Phone:</strong>+91 78001 65704
            </p>
            <p>
              📧 <strong>Email:</strong> info@dadimaaladdu.com
            </p>
          </div>

          {/* Social Media Links */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-[#BB4D00] mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <SocialIcon Icon={FaFacebookF} link="https://www.facebook.com" />
              <SocialIcon Icon={FaInstagram} link="https://www.instagram.com" />
              <SocialIcon Icon={FaTwitter} link="https://twitter.com" />
              <SocialIcon Icon={FaWhatsapp} link="https://wa.me/919876543210" />
              <SocialIcon Icon={FaYoutube} link="https://www.youtube.com" />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-8 rounded-2xl shadow-lg"
        >
          <h3 className="text-2xl font-semibold text-[#BB4D00] mb-6">
            Send a Message
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BB4D00]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BB4D00]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Contact Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BB4D00]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BB4D00]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#BB4D00] text-white hover:bg-[#a03f00]"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </section>

      {/* Map Section */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold text-center text-[#BB4D00] mb-6">
          Find Us on the Map
        </h2>
        <div className="w-full h-[400px] md:h-[500px]">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3422.813167866138!2d80.90667347543481!3d26.777802676727816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDQ2JzQwLjEiTiA4MMKwNTQnMzMuMyJF!5e1!3m2!1sen!2sin!4v1763714832372!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
} 

// ✅ Small helper for social icons
function SocialIcon({ Icon, link }) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#BB4D00] text-white p-3 rounded-full hover:bg-[#a03f00] transition-transform transform hover:scale-110"
    >
      <Icon size={20} />
    </Link>
  );
}
