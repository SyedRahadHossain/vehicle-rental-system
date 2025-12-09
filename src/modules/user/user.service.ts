import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );
  return result.rows;
};

const updateUser = async (id: string, payload: any) => {
  const updates = Object.keys(payload)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");

  const query = `UPDATE users SET ${updates} WHERE id = $1 RETURNING id, name, email, phone, role`;
  const values = [id, ...Object.values(payload)];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const bookings = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'",
    [id]
  );

  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return null;
};

export const UserService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
