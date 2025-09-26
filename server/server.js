import express, { response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cdb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
const app = express();
const port = process.env.PORT || 3000;


cdb();
app.use(express.json());
app.use(cookieParser());

const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);


app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
const PORT = process.env.PORT || 3000;
export default app;
