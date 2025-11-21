"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";
import toast from "react-hot-toast";

export default function SignupForm() {
  const router = useRouter();
  const { step, message, loading, sendOtp, verifyOtp, goToStep } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    password: "",
    phone: "",
  });

  // ----------------------------
  // HANDLERS
  // ----------------------------

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    const res = await sendOtp(email);

    if (res?.success) {
      toast.success(res.message || "OTP sent successfully!");
    } else {
      toast.error(res?.message || "Failed to send OTP.");
    }
  };

 const handleVerifyOtp = async (e) => {
  e.preventDefault();

  // 1️⃣ OTP must be 4 digits
  if (!/^[0-9]{4}$/.test(otp)) {
    toast.error("Please enter a valid 4-digit OTP.");
    return;
  }

  // 2️⃣ Phone must be 10 digits
  if (!/^[0-9]{10}$/.test(form.phone)) {
    toast.error("Please enter a valid 10-digit phone number.");
    return;
  }

  // 3️⃣ Password must be minimum 4 characters
  if (form.password.length < 4) {
    toast.error("Password must be at least 4 characters long.");
    return;
  }

  const data = { email, otp, ...form };

  const res = await verifyOtp(data, router);

  if (res?.success) {
    toast.success("Signup successful!");
  }  
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 py-10 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-orange-200 shadow-xl rounded-3xl p-8 transform transition-all duration-300">
        
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-[#BB4D00]">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mt-2 text-sm">
          {step === 1
            ? "Enter your email to receive a secure OTP"
            : "Verify OTP & complete your profile"}
        </p>

        <div className="mt-6">
          {/* STEP 1 → Email Input */}
          {step === 1 && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-5 animate-fadeIn"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#BB4D00] focus:border-[#BB4D00] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#BB4D00] hover:bg-[#a04400] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 → OTP + Details */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-5 animate-fadeIn"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={4}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#BB4D00] focus:border-[#BB4D00] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#BB4D00] focus:border-[#BB4D00] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Min 4 characters"
                  value={form.password}
                  onChange={handleFormChange}
                  required
                  minLength={4}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#BB4D00] focus:border-[#BB4D00] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="text"
                  placeholder="Enter 10-digit phone number"
                  value={form.phone}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, "");
                    setForm((prev) => ({ ...prev, phone: numeric }));
                  }}
                  maxLength={10}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#BB4D00] focus:border-[#BB4D00] transition"
                />
              </div>

              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="w-1/3 border border-[#BB4D00] text-[#BB4D00] py-2 rounded-lg hover:bg-orange-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-[#BB4D00] hover:bg-[#a04400] text-white py-3 rounded-lg shadow-md transition"
                >
                  {loading ? "Verifying..." : "Verify & Register"}
                </button>
              </div>
            </form>
          )}

          {/* Bottom Message */}
          {message && (
            <p className="mt-5 text-center text-sm text-gray-700 bg-orange-50 py-2 px-3 rounded-md border border-orange-200">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
