import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth, errorCheckingAuth } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (errorCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Đã có lỗi xảy ra khi kiểm tra trạng thái đăng nhập. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  const handleProductSave = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme={theme}
    >
      <Navbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#d1fae5",
              color: "#065f46",
            },
            icon: "✅",
          },
          error: {
            style: {
              background: "#fee2e2",
              color: "#991b1b",
            },
            icon: "❌",
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/product/:id"
          element={<ProductPage onSave={handleProductSave} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
