"use client";

import { useState } from "react";
import { fetcher } from "@/services/api";

// Simple auth hook
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Assume API returns { token, user }
      if (data?.token) {
        localStorage.setItem("token", data.token); // Save token
        setUser(data.user);
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Check if user is logged in
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };
}
