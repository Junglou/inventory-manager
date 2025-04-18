import { verifyToken } from "../lib/jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied.",
    });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) throw new Error("Invalid token");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid.",
    });
  }
};
