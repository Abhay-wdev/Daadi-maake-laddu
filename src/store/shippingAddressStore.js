"use client";

import { create } from "zustand";
import axios from "axios";

// Optional: import auth store if needed
// import { useAuthStore } from "./UserStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Add your backend host here
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useShippingAddressStore = create((set, get) => ({
  addresses: [],
  currentAddress: null,
  loading: false,
  message: "",
  error: "",

  // ==========================
  // CREATE NEW ADDRESS
  // ==========================
  createAddress: async (data) => {
    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.post("/shippingaddress", data);
      set((state) => ({
        addresses: [res.data.data, ...state.addresses],
        message: res.data.message || "Address added successfully",
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error creating address",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // GET ALL ADDRESSES BY USER ID
  // ==========================
  getUserAddresses: async (userId) => {
    console.log("Fetching addresses for userId:", userId);
    if (!userId) return;
    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.get(`/shippingaddress/user/${userId}`);
      console.log("Fetched addresses:", res.data.data);
      set({ addresses: res.data.data || [] });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error fetching addresses",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // GET SINGLE ADDRESS BY ID
  // ==========================
  getAddressById: async (id) => {
    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.get(`/shippingaddress/${id}`);
      set({ currentAddress: res.data.data });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error fetching address",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // UPDATE ADDRESS
  // ==========================
  updateAddress: async (id, updatedData) => {
    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.put(`/shippingaddress/${id}`, updatedData);
      set((state) => ({
        addresses: state.addresses.map((a) => (a._id === id ? res.data.data : a)),
        message: res.data.message || "Address updated successfully",
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error updating address",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // DELETE ADDRESS
  // ==========================
  deleteAddress: async (id) => {
    set({ loading: true, message: "", error: "" });
    try {
      const res = await api.delete(`/shippingaddress/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((a) => a._id !== id),
        message: res.data.message || "Address deleted successfully",
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error deleting address",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // RESET STORE STATE
  // ==========================
  clearMessages: () => set({ message: "", error: "" }),
}));
