import express from "express";
import { isLogged, login, logout, register, resetPassword, sendResetPassword, sendVerifyOtp, verifyOtp } from "../controller/authController.js";
import { userAuth } from "../middleware/auth.js";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp);
authRouter.post("/verify-account",userAuth,verifyOtp);
authRouter.post('/is-auth',userAuth,isLogged);
authRouter.post('/send-reset-password',userAuth,sendResetPassword);
authRouter.post('/reset-password',userAuth,resetPassword);
export default authRouter;
