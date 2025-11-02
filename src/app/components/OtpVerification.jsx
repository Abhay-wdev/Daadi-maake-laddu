"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const OtpVerification = ({ formData, setStep }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://dadimaabackend.onrender.com/auth/verify-otp", {
        ...formData,
        otp,
      });

      if (res.status === 201) {
        setMessage("✅ Account created! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          name="otp"
          type="text"
          maxLength="4"
          placeholder="Enter 4-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md text-center tracking-widest text-lg"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Verify OTP
        </button>
      </form>

      <button
        onClick={() => setStep("signup")}
        className="block w-full text-center text-sm text-indigo-600 mt-3"
      >
        Go Back
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default OtpVerification;
