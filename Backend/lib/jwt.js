import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

// Hàm tạo JWT token
export const generalToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  // Tạo token với thời gian sống 1h
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// Hàm xác thực JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
