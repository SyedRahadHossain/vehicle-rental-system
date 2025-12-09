import express, { Application, Request, Response } from "express";
import cors from "cors";
import { AuthRoutes } from "./modules/auth/auth.route";
import { VehicleRoutes } from "./modules/vehicle/vehicle.route";
import { BookingRoutes } from "./modules/booking/booking.route";
import { UserRoutes } from "./modules/user/user.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import initDB from "./config/db";

const app: Application = express();

app.use(express.json());
app.use(cors());

initDB();

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/vehicles", VehicleRoutes);
app.use("/api/v1/bookings", BookingRoutes);
app.use("/api/v1/users", UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System API is Running");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

app.use(globalErrorHandler);

export default app;
