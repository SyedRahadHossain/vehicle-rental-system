import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  connection_str: process.env.CONNECTION_STR,
  jwt_secret: process.env.JWT_SECRET,
};
