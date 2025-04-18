import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config(); // Tải các biến môi trường từ file .env

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

export const ConnectDB = async () => {
  try {
    // Tạo bảng products nếu chưa tồn tại
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL (10, 2) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Tạo bảng users nếu chưa tồn tại
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Thêm cột avatar nếu chưa tồn tại trong bảng users
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS avatar TEXT;
    `;

    console.log("Connected to the database and ensured tables exist.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
