"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/UserStore";
import { FaEdit, FaSave, FaSignOutAlt, FaCamera } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const { user, getUserById, updateUser, message, loading, logout } =
    useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Theme colors
  const themeColor = "#943900";
  const themeLight = "#c46e00"; // Lighter shade for hover states
  const themeBackground = "#f5e6d0"; // Light background for active states

  // ✅ Get initials
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // ✅ Ensure we always get latest user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?._id) getUserById(parsedUser._id);
        else router.push("/login");
      } catch (err) {
        console.error("Failed to parse user:", err);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [getUserById, router]);

  // ✅ Whenever user changes, update form fields
  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await updateUser(user._id, form, file);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div 
        className="flex justify-between items-center px-6 py-4 text-white"
        style={{ background: `linear-gradient(to right, ${themeColor}, ${themeLight})` }}
      >
        <h2 className="text-xl font-semibold">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition"
          style={{ 
            backgroundColor: "white", 
            color: themeColor 
          }}
        >
          {isEditing ? <FaSave /> : <FaEdit />}
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {message && (
          <p 
            className="mb-4 text-center font-medium p-2 rounded-lg"
            style={{ 
              color: themeColor,
              backgroundColor: themeBackground 
            }}
          >
            {message}
          </p>
        )}

        {/* Profile Picture or Initials */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover shadow-md"
                style={{ border: `4px solid ${themeBackground}` }}
              />
            ) : (
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-semibold shadow-md"
                style={{ 
                  background: `linear-gradient(to right, ${themeColor}, ${themeLight})`,
                  border: `4px solid ${themeBackground}` 
                }}
              >
                {getInitials(user?.name)}
              </div>
            )}

            {isEditing && (
              <label
                htmlFor="fileInput"
                className="absolute bottom-1 right-1 text-white p-2 rounded-full cursor-pointer shadow-md transition"
                style={{ backgroundColor: themeColor }}
              >
                <FaCamera className="text-sm" />
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            )}
          </div>

          <h3 className="mt-4 text-lg font-semibold" style={{ color: themeColor }}>{form.name}</h3>
          <p className="text-gray-500 text-sm">{form.email}</p>
          {form.phone && (
            <p className="text-gray-600 text-sm mt-1">📞 {form.phone}</p>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded-lg transition ${
                isEditing
                  ? ""
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              style={{ 
                borderColor: isEditing ? themeColor : "transparent",
                backgroundColor: isEditing ? "white" : "#f9f9f9"
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full border px-4 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border px-4 py-2 rounded-lg transition ${
                isEditing
                  ? ""
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              style={{ 
                borderColor: isEditing ? themeColor : "transparent",
                backgroundColor: isEditing ? "white" : "#f9f9f9"
              }}
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 text-white py-2 rounded-lg transition font-medium"
              style={{ backgroundColor: themeColor }}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          )}
        </form>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => logout(router)}
            className="inline-flex items-center gap-2 font-medium hover:underline transition"
            style={{ color: themeColor }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}