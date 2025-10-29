"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.open("http://localhost:8080/auth/google", "_self");
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
    >
      <FcGoogle size={20} />
      <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
    </button>
  );
};

export default GoogleButton;
