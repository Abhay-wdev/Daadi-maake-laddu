"use client";

import { create } from "zustand";
import api from "../app/admin/services/api";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  users: [],
  message: "",
  error: "",        // ✅ ADDED ERROR STATE (missing)
  loading: false,
  step: 1,

  // =========================================================
  // LOGIN
  // =========================================================
  login: async (form, router) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await api.post(`${BASE_URL}/user/login`, form);
      const { success, token, user, message } = res.data;

      if (success) {
        // Save data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);

        // Save address
        if (user?.shippingAddress?._id) {
          localStorage.setItem("createdAddressId", user.shippingAddress._id);
        } else if (user?.addresses?.length > 0) {
          const defaultAddress =
            user.addresses.find((a) => a.isDefault) || user.addresses[0];
          if (defaultAddress?._id) {
            localStorage.setItem("createdAddressId", defaultAddress._id);
          }
        }

        // Redirect
        if (router) {
          router.push(user.role === "admin" ? "/admin" : "/");
        }

        set({
          loading: false,
          user,
          token,
          message: message || "Login successful",
          error: "",
        });

        return { success: true, user, token }; // ⭐ RETURN RESULT
      }

      set({
        loading: false,
        error: message || "Login failed",
      });

      return { success: false, error: message || "Login failed" }; // ⭐ RETURN
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.message;

      set({
        loading: false,
        error: backendMsg,
      });

      return { success: false, error: backendMsg }; // ⭐ RETURN
    }
  },

  // =========================================================
  // LOGOUT
  // =========================================================
  logout: (router) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("createdAddressId");

    set({
      user: null,
      token: null,
      message: "Logged out successfully",
      error: "",
    });

    router.push("/login");
  },

  // =========================================================
  // SEND SIGNUP OTP
  // =========================================================
  sendOtp: async (email) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await api.post(`${BASE_URL}/auth/send-otp`, { email });

      if (res.data.success) {
        set({
          message: res.data.message || "OTP sent successfully!",
          step: 2,
        });
      } else {
        set({
          error: res.data.message || "Failed to send OTP",
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error sending OTP",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // VERIFY SIGNUP OTP
  // =========================================================
  verifyOtp: async (data, router) => {
    try {
      set({ loading: true, message: "", error: "" });
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
          error: "",
        });

        setTimeout(() => router.push("/"), 1500);
      } else {
        set({ error: res.data.message || "OTP verification failed" });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Verification failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // SEND FORGOT OTP
  // =========================================================
  sendForgotPasswordOtp: async (email) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await api.post(
        `${BASE_URL}/auth/send-forgot-password-otp`,
        { email }
      );

      if (res.data.success) {
        set({
          message:
            res.data.message || "Password reset OTP sent successfully!",
          step: 2,
        });
      } else {
        set({ error: res.data.message || "Failed to send reset OTP" });
      }
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "Error sending password reset OTP",
      });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // RESET PASSWORD
  // =========================================================
  resetPassword: async (data, router) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await api.post(`${BASE_URL}/auth/reset-password`, data);

      if (res.data.success) {
        set({
          message: res.data.message || "Password reset successful!",
          error: "",
          step: 1,
        });

        setTimeout(() => router.push("/login"), 1500);
      } else {
        set({ error: res.data.message || "Password reset failed" });
      }
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Error resetting password. Try again later.",
      });
    } finally {
      set({ loading: false });
    }
  },

  goToStep: (step) => set({ step, message: "", error: "" }),

  // =========================================================
  // USER MANAGEMENT
  // =========================================================
  getAllUsers: async () => {
    try {
      set({ loading: true, error: "" });

      const token = get().token || localStorage.getItem("token");

      const res = await api.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ users: res.data.users || [] });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
      });
    } finally {
      set({ loading: false });
    }
  },

  getUserById: async (userId) => {
    try {
      set({ loading: true, error: "" });

      const token = get().token || localStorage.getItem("token");

      const res = await api.get(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ user: res.data.user });
    } catch (err) {
      set({ error: err.response?.data?.message || "User not found" });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (userId, updatedData, file = null) => {
    try {
      set({ loading: true, message: "", error: "" });

      const token = get().token || localStorage.getItem("token");

      const formData = new FormData();
      Object.entries(updatedData).forEach(([k, v]) =>
        formData.append(k, v)
      );
      if (file) formData.append("image", file);

      const res = await api.put(
        `${BASE_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        set({
          user: updatedUser,
          message: "Profile updated successfully!",
          error: "",
        });
      } else {
        set({ error: res.data.message || "Update failed" });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ loading: true, error: "" });

      const token = get().token || localStorage.getItem("token");

      await api.delete(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        message: "User deleted successfully",
        users: get().users.filter((u) => u._id !== userId),
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete user",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
