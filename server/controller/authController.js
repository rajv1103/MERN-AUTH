// Import JWT for token generation
import jwt from "jsonwebtoken";

// Import bcryptjs for password hashing and comparison
import bcrypt from "bcryptjs";

// Import user model to interact with MongoDB
import userModel from "../models/models.js";

// 🧾 REGISTER FUNCTION
export const register = async (req, res) => {
  // Destructure name, email, password from request body
  const { name, email, password } = req.body;

  // Check if any field is missing
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Fill all entries" });
  }

  try {
    // Check if user already exists in DB
    const existuser = await userModel.findOne({ email });

    // If user exists, return error
    if (existuser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash the password with salt rounds = 10
    const hashpw = await bcrypt.hash(password, 10);

    // Create new user document
    const user = new userModel({
      name,
      email,
      password: hashpw,
    });

    // Save user to DB
    await user.save();

    // Generate JWT token with user ID and 7-day expiry
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in cookie with security options
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-site cookie rules
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry in ms (7 days)
    });

    // Return success response
    return res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    // Catch and return error message
    return res.json({ success: false, message: error.message });
  }
};

// 🔐 LOGIN FUNCTION
export const login = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Check if both fields are provided
  if (!email || !password)
    return res.json({
      success: false,
      message: "Email and Password are required",
    });

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    // Compare entered password with hashed password
    const match = await bcrypt.compare(password, user.password);

    // If password doesn't match, return error
    if (!match)
      return res.json({ success: false, message: "password not matches" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in cookie
    res.cookie(
      "token",
      token,
      { maxAge: 7 * 24 * 60 * 60 * 1000 }, 
      {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        secure: process.env.NODE_ENV === "production",
      }
    );

    // Return success response
    return res.json({ success: true });
  } catch (e) {
    // Catch and return login failure
    return res.json({ success: false, message: "Login Failed" });
  }
};

// 🚪 LOGOUT FUNCTION
export const logout = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Return success response
    return res.json({ success: true, message: "LogOut Successfully" });
  } catch (e) {
    // Catch and return error
    return res.json({ success: false, message: e.message });
  }
};