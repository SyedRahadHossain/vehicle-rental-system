import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";

const signup = async (payload: any) => {
  if (
    !payload.name ||
    !payload.email ||
    !payload.password ||
    !payload.phone ||
    !payload.role
  ) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const query = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
  `;

  const result = await pool.query(query, [
    payload.name,
    payload.email,
    hashedPassword,
    payload.phone,
    payload.role,
  ]);

  return result.rows[0];
};

const signin = async (payload: any) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    payload.email,
  ]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    config.jwt_secret as string,
    { expiresIn: "30d" }
  );

  delete user.password;

  return { token, user };
};

export const AuthService = {
  signup,
  signin,
};
