import express from "express";
import {
  getAllUsers,
  signUpUser,
  getUserById,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
