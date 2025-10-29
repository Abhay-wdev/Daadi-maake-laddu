import { create } from "zustand";
import axios from "axios";

const API_URL = "https://ecom-backend-1-cv44.onrender.com/api/hero";

export const useHeroStore = create((set, get) => ({
  heroImages: [],
  loading: false,
  error: null,

  fetchHeroImages: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get(API_URL);
      set({ heroImages: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  uploadHeroImages: async (files, links) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));
      links.forEach((link) => formData.append("links", link));
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({ 
        heroImages: [...state.heroImages, ...data.images], 
        loading: false 
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteHeroImage: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({ 
        heroImages: state.heroImages.filter((img) => img._id !== id) 
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateHeroImage: async (id, link) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, { link });
      set((state) => ({
        heroImages: state.heroImages.map((img) => 
          img._id === id ? data : img
        ),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  reorderHeroImages: async (orderIds) => {
    try {
      set({ loading: true });
      const { data } = await axios.put(`${API_URL}/reorder`, { order: orderIds });
      set({ heroImages: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));