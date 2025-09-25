import mongoose from "mongoose";

const cdb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    await mongoose.connect(`${process.env.DB_URL}/mern-auth`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default cdb;
