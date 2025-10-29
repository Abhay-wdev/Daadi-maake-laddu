import { create } from "zustand";
import axios from "axios";

const API_BASE = "https://ecom-backend-1-cv44.onrender.com/api/cart";

const useCartStore = create((set, get) => ({
  cart: {
    _id: "",
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
      // The API returns { success: true, cart: {...} }
      set({ cart: data.cart || get().cart, loading: false });
      return data.cart; // Return the cart data for use in components
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return null;
    }
  },

  // ===============================
  // ➕ Add item to cart
  // ===============================
  addItem: async (userId, productId, quantity = 1, variant = {}, token) => {
    const prevCart = get().cart;
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

  // ===============================
  // ✏️ Update item quantity
  // ===============================
  updateItem: async (userId, productId, quantity, token) => {
    const prevCart = get().cart;
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

  // ===============================
  // ❌ Remove item from cart
  // ===============================
  removeItem: async (userId, productId, token) => {
    const prevCart = get().cart;
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

  // ===============================
  // 🧹 Clear cart
  // ===============================
  clearCart: async (userId, token) => {
    set({ loading: true, error: null });

    try {
      await axios.delete(`${API_BASE}/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ 
        cart: {
          _id: "",
          user: "",
          items: [],
          discount: 0,
          totalPrice: 0,
          grandTotal: 0,
          status: "active",
        }, 
        loading: false 
      });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ===============================
  // 🎟️ Apply coupon
  // ===============================
  applyCoupon: async (userId, couponCode, token) => {
    const prevCart = get().cart;
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
}));

export default useCartStore;