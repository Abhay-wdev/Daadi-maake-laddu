import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "https://ecom-backend-4-ysxq.onrender.com/api/products",
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Convert data to FormData for files + JSON fields
const appendToFormData = (formData, data) => {
  for (let key in data) {
    if (key === "images" && Array.isArray(data.images)) {
      data.images.forEach((file) => formData.append("images", file));
    } else if (key === "tags" && Array.isArray(data.tags)) {
      formData.append("tags", JSON.stringify(data.tags));
    } else if (typeof data[key] === "object") {
      formData.append(key, JSON.stringify(data[key]));
    } else if (data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  }
};

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  // =========================
  // FETCH PRODUCTS
  // =========================
  fetchProducts: async ({ search = "", limit = 50, categoryId, subCategoryId, tags } = {}) => {
    set({ loading: true });
    try {
      let query = `?search=${search}&limit=${limit}`;
      if (categoryId) query += `&category=${categoryId}`;
      if (subCategoryId) query += `&subCategory=${subCategoryId}`;
      if (tags && tags.length > 0) query += `&tags=${encodeURIComponent(JSON.stringify(tags))}`;

      const res = await api.get(query);
      set({ products: res.data.products, loading: false });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      set({ loading: false });
    }
  },

  // =========================
  // CREATE PRODUCT
  // =========================
  createProduct: async (data) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      appendToFormData(formData, data);
      const res = await api.post("/", formData);

      set((state) => ({ products: [res.data, ...state.products], loading: false }));
      toast.success("✅ Product created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      set({ loading: false });
    }
  },

  // =========================
  // UPDATE PRODUCT
  // =========================
  updateProduct: async (id, data) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      appendToFormData(formData, data);
      const res = await api.put(`/${id}`, formData);

      set((state) => ({
        products: state.products.map((p) => (p._id === id ? res.data : p)),
        loading: false,
      }));
      toast.success("✅ Product updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      set({ loading: false });
    }
  },

  // =========================
  // DELETE PRODUCT
  // =========================
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
      toast.success("🗑️ Product deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      set({ loading: false });
    }
  },
}));
