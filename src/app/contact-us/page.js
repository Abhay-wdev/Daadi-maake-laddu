"use client";
import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
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
      const res = await fetch("https://dadimaabackend-1.onrender.com/api/contact", {
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
      <section className="bg-[#BB4D00] text-white text-center py-14">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our
          products, orders, or anything else — our team is ready to help.
        </p>
      </section>

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
              📍 <strong>Address:</strong> 123 Healthy Street, Jaipur, Rajasthan, India
            </p>
            <p>
              📞 <strong>Phone:</strong> +91 98765 43210
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.229648062513!2d75.78727087543189!3d26.861477476680857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6f33f266ccf%3A0x48b7f56f9c2b6e50!2sJaipur%2C%20Rajasthan%2C%20India!5e0!3m2!1sen!2sin!4v1698672566643!5m2!1sen!2sin"
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
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#BB4D00] text-white p-3 rounded-full hover:bg-[#a03f00] transition-transform transform hover:scale-110"
    >
      <Icon size={20} />
    </a>
  );
}
