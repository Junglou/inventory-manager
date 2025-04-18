import { sql } from "../configs/db.js";
import bcrypt from "bcryptjs";
import { generalToken } from "../lib/jwt.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await sql`
      SELECT id, username, email, avatar, created_at FROM users
      ORDER BY created_at DESC
    `;
    res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const signUpUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${hashPassword})
      RETURNING id, username, email, avatar, created_at
    `;
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser[0],
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await sql`
      SELECT id, username, email, avatar, created_at FROM users WHERE id = ${id}
    `;
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched user successfully",
      data: user[0],
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generalToken(user[0]);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        token,
      },
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, avatar } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Kiểm tra xem email có bị trùng không
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email} AND id != ${id}
    `;
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Nếu có avatar, kiểm tra ảnh hợp lệ
    let avatarUrl = avatar;
    if (avatar) {
      const isUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(avatar);
      if (!isUrl) {
        return res.status(400).json({
          success: false,
          message: "Avatar URL is not valid",
        });
      }
      avatarUrl = avatar; // Xử lý avatar nếu cần
    }

    // Cập nhật thông tin người dùng
    const updatedUsers = await sql`
      UPDATE users
      SET username = ${username}, email = ${email}, avatar = ${avatarUrl}
      WHERE id = ${id}
      RETURNING id, username, email, avatar, created_at
    `;
    if (updatedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUsers[0],
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const resetSequence = async () => {
  try {
    await sql`
      SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users), true)
    `;
  } catch (error) {}
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await sql`
      DELETE FROM users WHERE id = ${id}
      RETURNING id, username, email, avatar, created_at
    `;
    if (deletedUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await resetSequence();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser[0],
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
