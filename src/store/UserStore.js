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

// ---------------------- LOGIN ----------------------
login: async (form, router) => {
  try {
    set({ loading: true, message: "" });
    const res = await api.post("/user/login", form);

    if (res.data.success) {
      const { token, user } = res.data;

      // 🔹 Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔹 Save address ID if available
      if (user?.address?._id) {
        localStorage.setItem("shippingAddressId", user.address._id);
        console.log("✅ Address ID saved to localStorage:", user.address._id);
      } else if (user?.addresses?.length > 0) {
        // (in case the backend sends multiple addresses)
        const defaultAddr =
          user.addresses.find((a) => a.isDefault) || user.addresses[0];
        if (defaultAddr?._id) {
          localStorage.setItem("shippingAddressId", defaultAddr._id);
          console.log("✅ Default Address ID saved:", defaultAddr._id);
        }
      }

      // 🔹 Update store
      set({ user, token, message: "Login successful!" });

      // 🔹 Redirect based on role
      const allowedRoles = ["admin", "seller", "manager"];
      const route = allowedRoles.includes(user.role) ? "/admin" : "/";
      setTimeout(() => router.push(route), 1500);
    } else {
      set({ message: res.data.message || "Invalid credentials" });
    }
  } catch (err) {
    set({ message: err.response?.data?.message || "Login failed" });
  } finally {
    set({ loading: false });
  }
},


  // ---------------------- LOGOUT ----------------------
  logout: (router) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, message: "Logout sucessfully" });
    router.push("/login");
  },

  // ---------------------- SIGNUP (OTP FLOW) ----------------------
  sendOtp: async (email) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post("/auth/send-otp", { email });

      if (res.data.success) {
        set({ message: res.data.message || "OTP sent successfully!", step: 2 });
      } else {
        set({ message: res.data.message || "Failed to send OTP" });
      }
    } catch (err) {
      set({ message: err.response?.data?.message || "Error sending OTP" });
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (data, router) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post("/auth/verify-otp", data);

      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({
          user,
          token,
          step: 1,
          message: "Signup successful! Redirecting...",
        });

        setTimeout(() => {
          set({ message: "", step: 1 });
          router.push("/");
        }, 1500);
      } else {
        set({ message: res.data.message || "OTP verification failed" });
      }
    } catch (err) {
      set({ message: err.response?.data?.message || "Verification failed" });
    } finally {
      set({ loading: false });
    }
  },

  goToStep: (step) => {
    set({ step, message: "" });
  },

  // ---------------------- USER MANAGEMENT ----------------------
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

      const res = await api.put(`/user/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        set({
          user: updatedUser,
          message: "Profile updated successfully!",
        });
      } else {
        set({ message: res.data.message || "Update failed" });
      }
    } catch (err) {
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
}));
