import express from "express";
import dotenv from "dotenv";
import { connect } from "./db/connection";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api/v1", userRoutes);

const port = process.env.PORT || 3000;
connect();
app.listen(port, () => {
  console.log(`server running on port - ${port}`);
});
