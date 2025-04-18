import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:8080";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state (added description here)
  formData: {
    name: "",
    price: "",
    image: "",
    description: "",
  },

  // set form data
  setFormData: (formData) => set({ formData }),

  // reset form to initial state
  resetForm: () =>
    set({ formData: { name: "", price: "", image: "", description: "" } }),

  // add product
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    const { formData } = get();

    // Check data before sending
    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Please fill in all product details.");
      set({ loading: false });
      return;
    }

    try {
      // Check formData before sending
      console.log("formData being sent:", formData);

      // Send POST request with formData
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully.");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      if (error.response) {
        console.log("Backend error details:", error.response.data);
        toast.error(
          `Server error: ${
            error.response.data.message || "Something went wrong"
          }`
        );
      } else {
        toast.error("An error occurred.");
      }
    } finally {
      set({ loading: false });
    }
  },

  // fetch all products
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.response && err.response.status === 429) {
        set({ error: "Rate limit exceeded", products: [] });
      } else {
        set({ error: "Something went wrong", products: [] });
      }
    } finally {
      set({ loading: false });
    }
  },

  // delete product
  deleteProduct: async (id) => {
    console.log("deleteProduct function called", id);
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error("An error occurred.");
    } finally {
      set({ loading: false });
    }
  },

  // fetch single product by ID
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // pre-fill form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: "An error occurred", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  // update product
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        formData // Send updated formData including description
      );
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully.");
    } catch (error) {
      toast.error("An error occurred.");
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },
}));
