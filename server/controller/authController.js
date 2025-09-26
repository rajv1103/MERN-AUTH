// 📦 Import dependencies
import jwt from "jsonwebtoken"; // For token generation
import bcrypt from "bcryptjs"; // For password hashing
import userModel from "../models/models.js"; // MongoDB user model
import {
  resetOtpMail,
  sendWelcomeEmail,
  verifyEmail,
} from "../config/resend.js";
// 🧾 REGISTER FUNCTION
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 🚫 Validate input
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill in all fields." });
  }

  try {
    // 🔍 Check if user already exists
    const existuser = await userModel.findOne({ email });
    if (existuser) {
      return res.json({ success: false, message: "User already exists." });
    }

    // 🔐 Hash password
    const hashpw = await bcrypt.hash(password, 10);

    // 🆕 Create new user
    const user = new userModel({ name, email, password: hashpw });
    await user.save();

    // 🪙 Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🍪 Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 📧 Send welcome email
    try {
      const emailResult = await sendWelcomeEmail({ to: email, name });
      if (!emailResult.success) {
        console.error("Email failed:", emailResult.error);
      }
      res.status(201).json({
        message: "User registered successfully",
        emailSent: emailResult.success,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }

    // ✅ Success response
    return res.json({ success: true, message: "User created successfully." });
  } catch (error) {
    console.error("❌ Registration Error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause || "No additional cause",
    });

    return res.json({
      success: false,
      message:
        "Registration failed due to a server error. Please try again later.",
    });
  }
};
// 🔐 LOGIN FUNCTION
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 🚫 Validate input
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    // 🔍 Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    // 🔐 Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Incorrect password." });
    }

    // 🪙 Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Success response
    return res.json({ success: true, message: "Login successful." });
  } catch (error) {
    // ❌ Log error
    console.error("Login Error:", error);
    return res.json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};
// 🚪 LOGOUT FUNCTION
export const logout = (req, res) => {
  try {
    // 🧹 Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Success response
    return res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    // ❌ Log error
    console.error("Logout Error:", error);
    return res.json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
    await user.save();

    try {
      const emailResult = await verifyEmail({
        to: user.email,
        name: user.name,
        otp,
      });
      if (!emailResult.success) {
        console.error("Email failed:", emailResult.error);
      }

      return res.status(201).json({
        success: true,
        message: "Verification mail sent successfully",
        emailSent: emailResult.success,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Verification mail failed",
        error: error.message,
      });
    }
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User already verified" });
    }

    const isOtpValid =
      user.verifyOtp === otp && Date.now() < user.verifyOtpExpireAt;

    if (isOtpValid) {
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
      user.isAccountVerified = true;
      await user.save();

      return res.json({ success: true, message: "User verified successfully" });
    }

    return res.json({ success: false, message: "Invalid or expired OTP" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const isLogged = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const sendResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 12 * 60 * 60 * 1000; // 12 hours from now
    await user.save();

    try {
      const isSend = await resetOtpMail({
        to: user.email,
        name: user.name,
        otp,
      });
      if (isSend.success) {
        return res.status(200).json({
          success: true,
          message: "Reset OTP email sent successfully",
        });
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Failed to send OTP email" });
      }
    } catch (mailError) {
      return res.status(500).json({
        success: false,
        message: "Error sending OTP email",
        error: mailError.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and OTP are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isOtpValid =
      user.resetOtp === otp && Date.now() <= user.resetOtpExpireAt;
    if (isOtpValid) {
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      const hashpww = await bcrypt.hash(newPassword, 10);
      user.password = hashpww;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
