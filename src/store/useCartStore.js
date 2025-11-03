// src/app/store/useCartStore.js
import { create } from "zustand";
import axios from "axios";

const API_BASE = "https://dadimaabackend-1.onrender.com/api/cart";

const useCartStore = create((set, get) => ({
  cart: {
    user: "",
    items: [],
    discount: 0,
    totalPrice: 0,
    grandTotal: 0,
    status: "active",
  },
  loading: false,
  error: null,

  // ===============================
  // 🛒 Fetch cart for a user
  // ===============================
  fetchCart: async (userId, token) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_BASE}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ cart: data.cart || get().cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return null;
    }
  },

  // ➕ Add item
  addItem: async (userId, productId, quantity = 1, variant = {}, token) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API_BASE}/add`,
        { userId, productId, quantity, variant },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ✏️ Update item
  updateItem: async (userId, productId, quantity, token) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_BASE}/update`,
        { userId, productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ❌ Remove item
  removeItem: async (userId, productId, token) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.delete(`${API_BASE}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, productId },
      });
      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // 🧹 Clear cart
  clearCart: async (userId, token) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE}/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        cart: {
          user: "",
          items: [],
          discount: 0,
          totalPrice: 0,
          grandTotal: 0,
          status: "active",
        },
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // 🎟️ Apply coupon
  applyCoupon: async (userId, couponCode, token) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API_BASE}/apply-coupon`,
        { userId, couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // 🧮 Calculate totals dynamically (optional)
  calculateTotals: () => {
    const { cart } = get();
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + (item.productSnapshot?.price || 0) * item.quantity,
      0
    );
    const discount = cart.discount || 0;
    const grandTotal = totalPrice - discount;
    return { totalPrice, discount, grandTotal };
  },
}));

export default useCartStore;
