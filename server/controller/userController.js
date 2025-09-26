import userModel from "../models/models.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)    
        .json({
          success: false,
          message: "User ID is required for authentication",
        });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
