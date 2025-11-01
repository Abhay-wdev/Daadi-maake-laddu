"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";

export default function SignupForm() {
  const router = useRouter();
  const { step, message, loading, sendOtp, verifyOtp, goToStep } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ name: "", password: "", phone: "" });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return alert("Enter a valid email");
    await sendOtp(email);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const data = { email, otp, ...form };
    await verifyOtp(data, router);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#BB4D00]">
        Create Account
      </h2>

      {/* STEP 1: Email Input */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BB4D00] text-white py-2 rounded-md hover:bg-[#a04400] transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP + Registration */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleFormChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />
          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleFormChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#BB4D00] outline-none"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="w-1/3 border border-[#BB4D00] text-[#BB4D00] py-2 rounded-md hover:bg-[#fff4ee] transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[#BB4D00] text-white py-2 rounded-md hover:bg-[#a04400] transition"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </div>
        </form>
      )}

      {/* Message */}
      {message && (
        <p className="mt-4 text-center text-gray-700 text-sm bg-gray-100 py-2 rounded-md">
          {message}
        </p>
      )}

      {/* 🔍 Dev Shortcut (Optional) */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <button
          type="button"
          onClick={() => goToStep(step === 1 ? 2 : 1)}
          className="underline"
        >
          Toggle Step (for testing)
        </button>
      </div>
    </div>
  );
}
