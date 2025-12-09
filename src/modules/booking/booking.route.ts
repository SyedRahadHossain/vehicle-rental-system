import express from "express";
import { BookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), BookingController.createBooking);
router.get("/", auth("admin", "customer"), BookingController.getAllBookings);
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  BookingController.updateBooking
);

export const BookingRoutes = router;
