import React from "react";
import { Link, useResolvedPath, useNavigate } from "react-router-dom";
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import ThemeSeletor from "./ThemeSeletor";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore"; // Đảm bảo đường dẫn đúng

const Navbar = () => {
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";
  const navigate = useNavigate();

  const { products } = useProductStore();
  const { authUser, logout } = useAuthStore(); // Lấy authUser và logout từ useAuthStore

  const handleLogout = () => {
    logout(); // Thực hiện đăng xuất
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-conten/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* LOGO */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest text-2xl 
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  QuyênQuyênBAKERY
                </span>
              </div>
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            <ThemeSeletor />

            {authUser ? (
              <>
                {/* Đăng xuất */}
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>

                {/* Avatar - Link đến Profile */}
                <Link
                  to="/profile"
                  className="hover:scale-105 transition-transform"
                >
                  <img
                    src={
                      authUser.avatar ||
                      "https://freemiumicons.com/wp-content/uploads/2023/02/star-wars-avatar-icon.png"
                    }
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                  />
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}

            {isHomePage && (
              <div className="indicator">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
