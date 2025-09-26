import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized User" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ success: false, message: "Invalid Token" });
    }
    req.body = req.body || {};
    req.body.userId = decoded.id;

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res
      .status(403)
      .json({ success: false, message: "Token Verification Failed" });
  }
};
