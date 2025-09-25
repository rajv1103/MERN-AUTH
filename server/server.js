import express, { response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cdb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"

const app = express();
const port = process.env.PORT || 3000;


cdb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.post('/',(req,res)=>{
  return res.json({message:"HIiii"});
})
app.use('/api/auth',authRouter);

const PORT = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
