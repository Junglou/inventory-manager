import express from "express";
import {
  createProduct,
  getAllProducts,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

//Get all products
router.get("/", getAllProducts);
//Get a single product by ID
router.get("/:id", getProducts);
//Craete a new product
router.post("/", createProduct);
//Update a product by ID
router.put("/:id", updateProduct);
//Delete a product by ID
router.delete("/:id", deleteProduct);

export default router;
