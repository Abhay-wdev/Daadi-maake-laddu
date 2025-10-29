"use client";

import { create } from "zustand";
import api from "../app/admin/services/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  users: [],
  message: "",
  loading: false,
  step: 1,

  login: async (form, router) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post("/user/login", form);

      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, token, message: "Login successful!" });

        const allowedRoles = ["admin", "seller", "manager"];
        const route = allowedRoles.includes(user.role) ? "/admin" : "/";
        setTimeout(() => router.push(route), 1500);
      }
    } catch (err) {
      set({ message: err.response?.data?.message || "Login failed" });
    } finally {
      set({ loading: false });
    }
  },

  logout: (router) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
    router.push("/login");
  },

  getAllUsers: async () => {
    try {
      set({ loading: true });
      const token = get().token || localStorage.getItem("token");
      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: res.data.users || [] });
    } catch (err) {
      set({ message: err.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ loading: false });
    }
  },

  getUserById: async (userId) => {
    try {
      set({ loading: true });
      const token = get().token || localStorage.getItem("token");
      const res = await api.get(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data.user });
    } catch (err) {
      set({ message: err.response?.data?.message || "User not found" });
    } finally {
      set({ loading: false });
    }
  },

updateUser: async (userId, updatedData, file = null) => {
  try {
    set({ loading: true, message: "" });

    const token = get().token || localStorage.getItem("token");
    const formData = new FormData();

    // Append text fields
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }

    // Append file if provided
    if (file) formData.append("image", file);

    // Send update request to backend
    const res = await api.put(`/user/update/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      const updatedUser = res.data.user;
      set({
        user: updatedUser,
        message: "Profile updated successfully!",
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      set({ message: res.data.message || "Update failed" });
    }
  } catch (err) {
    console.error("Update error:", err);
    set({
      message: err.response?.data?.message || "Something went wrong",
    });
  } finally {
    set({ loading: false });
  }
},


  deleteUser: async (userId) => {
    try {
      set({ loading: true });
      const token = get().token || localStorage.getItem("token");
      await api.delete(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        message: "User deleted successfully",
        users: get().users.filter((u) => u._id !== userId),
      });
    } catch (err) {
      set({ message: err.response?.data?.message || "Failed to delete user" });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (userId, productId) => {
    try {
      const token = get().token || localStorage.getItem("token");
      const res = await api.put(
        `/user/${userId}/cart`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) set({ user: res.data.user, message: "Added to cart" });
    } catch (err) {
      set({ message: err.response?.data?.message || "Failed to add to cart" });
    }
  },

  addToWishlist: async (userId, productId) => {
    try {
      const token = get().token || localStorage.getItem("token");
      const res = await api.put(
        `/user/${userId}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) set({ user: res.data.user, message: "Added to wishlist" });
    } catch (err) {
      set({ message: err.response?.data?.message || "Failed to add to wishlist" });
    }
  },
}));
