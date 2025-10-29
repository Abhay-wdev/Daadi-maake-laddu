"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();
  const { login, message, loading } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form, router);

    // Increment failed attempts if login fails
    if (message.includes("failed")) {
      setAttempts((prev) => prev + 1);
    } else {
      setAttempts(0);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-sm text-red-600">{message}</p>
      )}

      {attempts >= 3 && (
        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-indigo-600 hover:underline font-medium"
          >
            Forgot Password?
          </a>
        </div>
      )}

      <div className="mt-4 text-center">
        <span className="text-gray-600">Don&apos;t have an account? </span>
        <a
          href="/signup"
          className="text-indigo-600 hover:underline font-medium"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
