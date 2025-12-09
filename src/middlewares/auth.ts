import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("You are not authorized!");
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;

      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new Error("You are not authorized to access this route!");
      }

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
  };
};
