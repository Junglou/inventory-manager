import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please enter all required information!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        {
          username,
          email,
          password,
        }
      );

      if (response.status === 201) {
        toast.success("Sign up successful!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Sign up failed!");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred!");
      } else {
        toast.error("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
};

export default SignUpPage;
