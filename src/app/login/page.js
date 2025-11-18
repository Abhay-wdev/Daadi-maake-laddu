"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";
import Link from "next/link";
import {
  FaUser,
  FaLock,
  FaExclamationTriangle,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [attempts, setAttempts] = useState(0);

  const router = useRouter();
  const { login, message, error, loading } = useAuthStore();

  // ----------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // HANDLE FORGOT PASSWORD
  // ----------------------------
  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  // ----------------------------
  // HANDLE SUBMIT
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (form.password.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }

    const result = await login(form, router);

    if (!result?.success) {
      setAttempts((prev) => prev + 1);

      if (attempts + 1 === 2) {
        toast.error("Multiple failed attempts. Forgot password option enabled.", {
          duration: 4000,
          icon: <FaExclamationTriangle className="text-red-500" />,
        });
      }
    } else {
      setAttempts(0);
    }
  };

  // ----------------------------
  // TOAST MESSAGES
  // ----------------------------
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        icon: <FaTimes className="text-red-500" />,
      });
    }
    if (message) {
      toast.success(message);
    }
  }, [message, error]);

  // ----------------------------
  // RENDER UI
  // ----------------------------
  return (
    <div className="max-w-md mx-auto mt-16 p-1">

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-xl p-8 border border-amber-200">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-700 mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-amber-800">Welcome Back</h2>
          <p className="text-amber-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-amber-500" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700 placeholder-amber-400 transition duration-300"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-amber-500" />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password (min 4 characters)"
                value={form.password}
                onChange={handleChange}
                required
                minLength={4}
                className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700 placeholder-amber-400 transition duration-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 
                      0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 
                      7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                Login <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Section */}
        {attempts >= 2 && (
          <div className="mt-6 p-4 bg-amber-100 border border-amber-300 rounded-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-800 font-medium">
                  Having trouble signing in?
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  You've attempted login multiple times.
                </p>
                <button
                  onClick={handleForgotPassword}
                  className="mt-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center"
                >
                  Reset your password
                  <FaArrowRight className="ml-2 text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up */}
        <div className="mt-8 pt-6 border-t border-amber-200 text-center">
          <span className="text-amber-700">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="inline-flex items-center text-amber-700 hover:text-amber-800 font-semibold transition-colors duration-300"
          >
            Sign Up
            <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}
