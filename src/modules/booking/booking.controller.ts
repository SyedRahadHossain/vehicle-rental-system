import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  if (req.user.role === "customer") {
    req.body.customer_id = req.user.id;
  }

  const result = await BookingService.createBooking(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookings(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await BookingService.updateBooking(
    bookingId,
    req.body,
    req.user
  );
  const message =
    req.body.status === "cancelled"
      ? "Booking cancelled successfully"
      : "Booking marked as returned";
  sendResponse(res, { statusCode: 200, success: true, message, data: result });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
