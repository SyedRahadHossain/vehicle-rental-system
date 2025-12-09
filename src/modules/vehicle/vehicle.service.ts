import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
  const query = `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(query, [
    payload.vehicle_name,
    payload.type,
    payload.registration_number,
    payload.daily_rent_price,
    payload.availability_status,
  ]);
  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles");
  return result.rows;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
  return result.rows[0];
};

const updateVehicle = async (id: string, payload: any) => {
  const updates = Object.keys(payload)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");

  const query = `UPDATE vehicles SET ${updates} WHERE id = $1 RETURNING *`;
  const values = [id, ...Object.values(payload)];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteVehicle = async (id: string) => {
  const bookings = await pool.query(
    "SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'",
    [id]
  );

  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
  return null;
};

export const VehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
