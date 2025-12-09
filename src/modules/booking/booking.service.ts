import { pool } from "../../config/db";

const createBooking = async (payload: any) => {
  const vehicleRes = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    payload.vehicle_id,
  ]);
  const vehicle = vehicleRes.rows[0];

  if (!vehicle || vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const startDate = new Date(payload.rent_start_date);
  const endDate = new Date(payload.rent_end_date);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (days <= 0) throw new Error("End date must be after start date");

  const totalPrice = days * parseFloat(vehicle.daily_rent_price);

  const bookingQuery = `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
  `;

  const bookingRes = await pool.query(bookingQuery, [
    payload.customer_id,
    payload.vehicle_id,
    payload.rent_start_date,
    payload.rent_end_date,
    totalPrice,
  ]);

  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
    [payload.vehicle_id]
  );

  const newBooking = bookingRes.rows[0];

  return {
    ...newBooking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: any) => {
  let query = `
    SELECT b.*, 
    json_build_object('name', u.name, 'email', u.email) as customer,
    json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) as vehicle
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
  `;

  const params: any[] = [];

  if (user.role === "customer") {
    query += " WHERE b.customer_id = $1";
    params.push(user.id);
  }

  const result = await pool.query(query, params);
  return result.rows;
};

const updateBooking = async (bookingId: string, payload: any, user: any) => {
  const bookingRes = await pool.query("SELECT * FROM bookings WHERE id = $1", [
    bookingId,
  ]);
  const booking = bookingRes.rows[0];

  if (!booking) throw new Error("Booking not found");

  if (user.role === "customer") {
    if (payload.status !== "cancelled")
      throw new Error("Customers can only cancel bookings");
    if (booking.customer_id !== user.id)
      throw new Error("You can only cancel your own booking");
  }

  const updateQuery =
    "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *";
  const result = await pool.query(updateQuery, [payload.status, bookingId]);

  if (payload.status === "returned" || payload.status === "cancelled") {
    await pool.query(
      "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
      [booking.vehicle_id]
    );
  }

  const vehicleRes = await pool.query(
    "SELECT availability_status FROM vehicles WHERE id = $1",
    [booking.vehicle_id]
  );

  return {
    ...result.rows[0],
    vehicle: vehicleRes.rows[0],
  };
};

export const BookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
