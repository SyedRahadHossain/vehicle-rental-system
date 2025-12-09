import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    token?: string;
  }
) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    ...(data.token && { token: data.token }),
  });
};

export default sendResponse;
