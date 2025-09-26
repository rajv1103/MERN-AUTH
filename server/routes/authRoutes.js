import express from "express";
import { isLogged, login, logout, register, sendVerifyOtp, verifyOtp } from "../controller/authController.js";
import { userAuth } from "../middleware/auth.js";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp);
authRouter.post("/verify-account",userAuth,verifyOtp);
authRouter.post('/is-auth',userAuth,isLogged);
export default authRouter;
