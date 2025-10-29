"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";

const SignupForm = () => {
  const router = useRouter();
  const { step, message, loading, sendOtp, verifyOtp } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ name: "", password: "", phone: "" });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    await sendOtp(email);
  };

  // Step 2: Verify OTP and Create Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const data = { email, otp, ...form };
    await verifyOtp(data, router);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleFormChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleFormChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </form>
      )}

      {message && <p className="mt-3 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default SignupForm;
