"use client";

import { create } from "zustand";
import api from "../app/admin/services/api";

// Define base URL for API calls
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dadimaabackend.onrender.com/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  users: [],
  message: "",
  loading: false,
  step: 1, // 1 = email input, 2 = OTP verification

  // =========================================================
  // 🔹 LOGIN
  // =========================================================
  login: async (form, router) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post(`${BASE_URL}/user/login`, form);

      if (res.data.success) {
        const { token, user } = res.data;

        // Save token & user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Save default shipping address if exists
        if (user?.address?._id) {
          localStorage.setItem("shippingAddressId", user.address._id);
        } else if (user?.addresses?.length > 0) {
          const defaultAddr =
            user.addresses.find((a) => a.isDefault) || user.addresses[0];
          if (defaultAddr?._id) {
            localStorage.setItem("shippingAddressId", defaultAddr._id);
          }
        }

        // Update store
        set({ user, token, message: "Login successful!" });

        // Redirect by role
        const allowedRoles = ["admin", "seller", "manager"];
        const route = allowedRoles.includes(user.role) ? "/admin" : "/";
        setTimeout(() => router.push(route), 1500);
      } else {
        set({ message: res.data.message || "Invalid credentials" });
      }
    } catch (err) {
      set({
        message: err.response?.data?.message || "Login failed. Try again.",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // 🔹 LOGOUT
  // =========================================================
  logout: (router) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("shippingAddressId");
    set({ user: null, token: null, message: "Logged out successfully" });
    router.push("/login");
  },

  // =========================================================
  // 🔹 SIGNUP (SEND OTP)
  // Backend Route: POST /auth/send-registration-otp
  // =========================================================
  sendOtp: async (email) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post(`${BASE_URL}/auth/send-otp`, { email });

      if (res.data.success) {
        set({
          message: res.data.message || "OTP sent successfully!",
          step: 2,
        });
      } else {
        set({ message: res.data.message || "Failed to send OTP" });
      }
    } catch (err) {
      set({ message: err.response?.data?.message || "Error sending OTP" });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // 🔹 VERIFY OTP & REGISTER
  // Backend Route: POST /auth/verify-registration-otp
  // =========================================================
  verifyOtp: async (data, router) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post(`${BASE_URL}/auth/verify-otp`, data);

      if (res.data.success) {
        const { user, token } = res.data;
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
      set({
        message: err.response?.data?.message || "Verification failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // 🔹 FORGOT PASSWORD (SEND OTP)
  // Backend Route: POST /auth/send-forgot-password-otp
  // =========================================================
  sendForgotPasswordOtp: async (email) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post(`${BASE_URL}/auth/send-forgot-password-otp`, { email });

      if (res.data.success) {
        set({
          message: res.data.message || "Password reset OTP sent successfully!",
          step: 2,
        });
      } else {
        set({ message: res.data.message || "Failed to send reset OTP" });
      }
    } catch (err) {
      set({
        message:
          err.response?.data?.message || "Error sending password reset OTP",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // 🔹 RESET PASSWORD
  // Backend Route: POST /auth/reset-password
  // =========================================================
  resetPassword: async (data, router) => {
    try {
      set({ loading: true, message: "" });
      const res = await api.post(`${BASE_URL}/auth/reset-password`, data);

      if (res.data.success) {
        set({
          message: res.data.message || "Password reset successful!",
          step: 1,
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        set({ message: res.data.message || "Password reset failed" });
      }
    } catch (err) {
      set({
        message:
          err.response?.data?.message ||
          "Error resetting password. Try again later.",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // 🔹 STEP HANDLER
  // =========================================================
  goToStep: (step) => {
    set({ step, message: "" });
  },

  // =========================================================
  // 🔹 USER MANAGEMENT (ADMIN)
  // =========================================================
  getAllUsers: async () => {
    try {
      set({ loading: true });
      const token = get().token || localStorage.getItem("token");
      const res = await api.get(`${BASE_URL}/user`, {
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
      const res = await api.get(`${BASE_URL}/user/${userId}`, {
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
      Object.entries(updatedData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (file) formData.append("image", file);

      const res = await api.put(`${BASE_URL}/user/update/${userId}`, formData, {
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
      await api.delete(`${BASE_URL}/user/${userId}`, {
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