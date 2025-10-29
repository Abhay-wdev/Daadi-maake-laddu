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
        phone: user?.phone || "", // now will show correctly
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
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-white text-indigo-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          {isEditing ? <FaSave /> : <FaEdit />}
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {message && (
          <p className="mb-4 text-green-600 text-center font-medium bg-green-50 p-2 rounded-lg">
            {message}
          </p>
        )}

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={user?.image || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow-md"
            />
            {isEditing && (
              <label
                htmlFor="fileInput"
                className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700"
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
          <h3 className="mt-4 text-lg font-semibold">{form.name}</h3>
          <p className="text-gray-500 text-sm">{form.email}</p>
          {form.phone && (
            <p className="text-gray-600 text-sm mt-1">
              📞 {form.phone}
            </p>
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
                  ? "border-indigo-400 bg-white"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
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
                  ? "border-indigo-400 bg-white"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          )}
        </form>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => logout(router)}
            className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
