import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  login: async (email, password) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        set({
          authUser: response.data.data,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async (username, email, password) => {
    try {
      const response = await axios.post("/api/users/signup", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        set({
          authUser: response.data.data,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({
      authUser: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },

  checkAuth: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      set({
        authUser: user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } else {
      set({
        isCheckingAuth: false,
      });
    }
  },

  updateAvatar: (newAvatarUrl) =>
    set((state) => {
      const updatedUser = {
        ...state.authUser,
        avatar: newAvatarUrl,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { authUser: updatedUser };
    }),
}));
