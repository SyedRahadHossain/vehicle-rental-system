import { Pool } from "pg";
import config from "./index";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'customer')) NOT NULL
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10, 2) NOT NULL,
        availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available'
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        vehicle_id INTEGER REFERENCES vehicles(id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active'
        )
        `);
};

export default initDB;
