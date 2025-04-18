import { sql } from "../configs/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
    `;

    console.log("Fetched products:", products);
    res.status(200).json({
      success: true,
      message: "Fetched all products successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error getAllProduct in controller:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newProduct = await sql`
      INSERT INTO products (name, price, description, image)
      VALUES (${name}, ${price}, ${description}, ${image})
      RETURNING *;`;

    console.log("Created product:", newProduct);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct[0],
    });
  } catch (error) {
    console.error("Error getProduct in controller:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await sql`
    SELECT * FROM products WHERE id = ${id}`;

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched product successfully",
      data: product[0],
    });
  } catch (error) {
    console.error("Error createProduct in controller:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image } = req.body;

    const updateProduct = await sql`
    UPDATE products
    SET name = ${name}, price = ${price}, description = ${description}, image = ${image}
    WHERE id = ${id}
    RETURNING *`;

    if (updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updateProduct[0],
    });
  } catch (error) {
    console.error("Error updateProduct in controller:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Hàm để reset lại sequence về 1
const resetSequence = async () => {
  try {
    await sql`
    SELECT setval(pg_get_serial_sequence('products', 'id'), 1, false);
    `;
    console.log("Sequence reset to start from 1.");
  } catch (error) {
    console.error("Error resetting sequence:", error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteProduct = await sql`
    DELETE FROM products WHERE id = ${id}
    RETURNING *`;

    if (deleteProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await resetSequence();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deleteProduct[0],
    });
  } catch (error) {
    console.error("Error deleteProduct in controller:", error);
    res.status(500).send("Internal Server Error");
  }
};
