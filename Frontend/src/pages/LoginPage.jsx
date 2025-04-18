import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed, please try again!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">SignUp</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Log In
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
